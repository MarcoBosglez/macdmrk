import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";

// The address every message actually lands in. Not a secret (it's
// already printed in plain text on the contact page), so it doesn't
// need to be an env var.
const CONTACT_TO_EMAIL = "mark.bosglez@gmail.com";

// Resend requires either a verified sending domain or their shared
// onboarding@resend.dev address (works out of the box, but Resend
// restricts it to a lower volume than a verified domain would allow).
// Override via RESEND_FROM_EMAIL once a real domain is verified.
const CONTACT_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "macdmrk contact form <onboarding@resend.dev>";

// Both of these are lazily constructed so a missing env var only
// breaks this route (at request time) instead of failing the whole
// build — `next build` loads this module to collect route data, and
// both the Resend and Redis clients throw immediately if constructed
// eagerly with a missing key.
function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function getRatelimit() {
  const redis = Redis.fromEnv();
  return new Ratelimit({
    redis,
    // 3 submissions per 10 minutes per IP — enough for a real visitor
    // to retry a typo, not enough to be useful for spam.
    limiter: Ratelimit.slidingWindow(3, "10 m"),
    prefix: "contact-form",
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
  turnstileToken?: string;
  // Honeypot field: real visitors never see or fill this in (it's
  // visually hidden in the form), so anything non-bot leaves it
  // empty. Bots that blindly fill every field trip it.
  website?: string;
};

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  try {
    const { success } = await getRatelimit().limit(ip);
    if (!success) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  } catch (err) {
    console.error("contact form: rate limit check failed", err);
    return NextResponse.json({ ok: false, error: "Server misconfigured." }, { status: 500 });
  }

  const body = (await req.json().catch(() => null)) as ContactBody | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const { name, email, message, turnstileToken, website } = body;

  if (website) {
    // Silently pretend success so the bot doesn't learn its
    // submission was rejected.
    return NextResponse.json({ ok: true });
  }

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ ok: false, error: "All fields are required." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email address." }, { status: 400 });
  }
  if (message.length > 5000) {
    return NextResponse.json({ ok: false, error: "Message is too long." }, { status: 400 });
  }
  if (!turnstileToken) {
    return NextResponse.json({ ok: false, error: "CAPTCHA verification required." }, { status: 400 });
  }

  const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: turnstileToken,
      remoteip: ip,
    }),
  });
  const verifyData = (await verifyRes.json().catch(() => ({ success: false }))) as { success: boolean };
  if (!verifyData.success) {
    return NextResponse.json({ ok: false, error: "CAPTCHA verification failed." }, { status: 403 });
  }

  try {
    await getResend().emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `New contact form message from ${name}`,
      text: `${message}\n\n—\n${name} <${email}>`,
    });
  } catch (err) {
    console.error("contact form: email send failed", err);
    return NextResponse.json({ ok: false, error: "Failed to send message." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
