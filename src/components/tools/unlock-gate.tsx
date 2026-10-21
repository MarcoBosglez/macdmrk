"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

// A speed bump, not real security — this is a static site with no
// backend, so the passphrase (or any client-side check) is always
// inspectable in the shipped JS by anyone who looks. What this
// actually buys: a stranger who finds /lift or /meal by guessing the
// URL sees a locked screen instead of your workout/meal history, and
// can't casually poke at it. Change PASSPHRASE below to set your own;
// it's hashed (SHA-256) so it's not sitting in the bundle as plain
// text, but treat it as a lock, not a vault.
// Default passphrase is "liftmeal2026" — change it by hashing a new
// one and pasting the result here:
//   node -e "console.log(require('crypto').createHash('sha256').update('your new passphrase').digest('hex'))"
const PASSPHRASE_HASH = "4c160afb76331d4d7a17480662f871360ad4fa6fc000141b0ac30529f6fd9d55";

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const STORAGE_KEY = "tools-unlocked";

export function UnlockGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [btnOn, setBtnOn] = useState(false);

  useEffect(() => {
    try {
      setUnlocked(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      setUnlocked(false);
    }
  }, []);

  async function tryUnlock(e: React.FormEvent) {
    e.preventDefault();
    const hash = await sha256(input.trim());
    if (hash === PASSPHRASE_HASH) {
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {}
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (unlocked === null) return null;

  if (!unlocked) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <form
          onSubmit={tryUnlock}
          className="animate-fade flex w-full max-w-[320px] flex-col gap-4 rounded-[22px] border border-line bg-panel p-6 [backdrop-filter:blur(22px)_saturate(1.3)] [box-shadow:var(--shadow)]"
        >
          <div
            className="flex h-11 w-11 items-center justify-center self-start rounded-full border border-line"
            style={{ background: "var(--wash)" }}
          >
            <Lock className="h-[18px] w-[18px] text-accent" />
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-accent">
              private
            </span>
            <p className="text-[13px] leading-relaxed text-dim">
              Not part of the portfolio — just a personal tool. Enter the passphrase to continue.
            </p>
          </div>

          {/* Icon-in-input pill, glowing on focus — same mechanics as
              the snippet (icon absolutely positioned, transparent
              border that lights up, a soft colour ring), just in the
              site's own mono/accent palette instead of indigo/slate. */}
          <div className="group relative flex items-center">
            <Lock
              className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted transition-colors group-focus-within:text-accent"
              aria-hidden="true"
            />
            <input
              type="password"
              autoFocus
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(false);
              }}
              placeholder="passphrase"
              className="w-full rounded-[14px] border-2 border-transparent bg-bg py-3 pr-4 pl-10 font-mono text-[14px] text-ink placeholder-muted outline-none transition-[border-color,box-shadow] duration-300 focus:border-line-hot focus:shadow-[0_0_0_5px_color-mix(in_srgb,var(--accent)_25%,transparent)]"
            />
          </div>

          {error ? (
            <span className="font-mono text-[11px]" style={{ color: "#c0453f" }}>
              that's not it
            </span>
          ) : null}

          <button
            type="submit"
            onMouseEnter={() => setBtnOn(true)}
            onMouseLeave={() => setBtnOn(false)}
            className="rounded-[14px] bg-accent px-4 py-2.5 font-mono text-[12px] font-bold text-bg"
            style={{
              transform: btnOn ? "translateY(-2px)" : undefined,
              boxShadow: btnOn ? "0 10px 24px -8px var(--accent)" : undefined,
              transition: "transform .2s cubic-bezier(.2,.8,.3,1), box-shadow .2s ease",
            }}
          >
            unlock →
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
