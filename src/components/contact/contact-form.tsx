"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { useSound } from "@/components/providers/sound-provider";

// Minimal surface of the global `turnstile` object Cloudflare's widget
// script attaches to `window` once loaded.
declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          theme?: "auto" | "light" | "dark";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

type Status = "idle" | "submitting" | "success" | "error";

// The working contact form, nested in the left panel of ContactView.
// Spam defense is layered: a Cloudflare Turnstile challenge, a honeypot
// field real users never see, and server-side rate limiting (see
// src/app/api/contact/route.ts) — this component only owns the UI and
// the fetch to that route.
export function ContactForm() {
  const { t } = useLocale();
  const { playClick } = useSound();

  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const tokenRef = useRef("");
  const formRef = useRef<HTMLFormElement>(null);

  const [turnstileReady, setTurnstileReady] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!turnstileReady || !siteKey || !widgetRef.current || widgetIdRef.current) return;
    widgetIdRef.current = window.turnstile!.render(widgetRef.current, {
      sitekey: siteKey,
      theme: "auto",
      callback: (token) => {
        tokenRef.current = token;
      },
      "expired-callback": () => {
        tokenRef.current = "";
      },
    });
  }, [turnstileReady, siteKey]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    playClick("nav");

    if (!tokenRef.current) {
      setStatus("error");
      setErrorMessage(t.contact.form.captchaRequired);
      return;
    }

    setStatus("submitting");
    setErrorMessage("");
    const data = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          website: data.get("website"),
          turnstileToken: tokenRef.current,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || t.contact.form.genericError);

      setStatus("success");
      formRef.current?.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : t.contact.form.genericError);
    } finally {
      if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
      tokenRef.current = "";
    }
  }

  return (
    <div>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={() => setTurnstileReady(true)}
      />
      <div className="mb-3 font-mono text-[11px] text-accent">{t.contact.form.heading}</div>
      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {/* Honeypot — visually hidden (not display:none, which some
            bots skip filling for exactly that reason) and out of tab
            order, so a real visitor never notices or fills it in. */}
        <label className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] text-muted">{t.contact.form.nameLabel}</span>
          <input
            type="text"
            name="name"
            required
            maxLength={200}
            placeholder={t.contact.form.namePlaceholder}
            onKeyDown={() => playClick("nav")}
            className="rounded border border-line bg-transparent px-3 py-2 font-mono text-sm outline-none transition-colors focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] text-muted">{t.contact.form.emailLabel}</span>
          <input
            type="email"
            name="email"
            required
            maxLength={320}
            placeholder={t.contact.form.emailPlaceholder}
            onKeyDown={() => playClick("nav")}
            className="rounded border border-line bg-transparent px-3 py-2 font-mono text-sm outline-none transition-colors focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] text-muted">{t.contact.form.messageLabel}</span>
          <textarea
            name="message"
            required
            maxLength={5000}
            rows={5}
            placeholder={t.contact.form.messagePlaceholder}
            onKeyDown={() => playClick("nav")}
            className="resize-none rounded border border-line bg-transparent px-3 py-2 font-mono text-sm outline-none transition-colors focus:border-accent"
          />
        </label>

        <div ref={widgetRef}>
          {!turnstileReady ? (
            <span className="font-mono text-[11px] text-muted">{t.contact.form.captchaLoading}</span>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="self-start rounded-full bg-accent px-4.5 py-2 font-mono text-[13px] font-bold text-bg transition-opacity disabled:opacity-60"
        >
          {status === "submitting" ? t.contact.form.sending : t.contact.form.send}
        </button>

        {status === "success" ? (
          <p className="font-mono text-[12px] text-accent">{t.contact.form.success}</p>
        ) : null}
        {status === "error" ? (
          <p className="font-mono text-[12px] text-[color:var(--destructive)]">{errorMessage}</p>
        ) : null}
      </form>
    </div>
  );
}
