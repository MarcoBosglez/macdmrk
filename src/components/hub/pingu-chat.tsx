"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";

type MessageStatus = "thinking" | "typing" | "done";
type ChatMessage = { id: number; role: "bot" | "user"; text: string; status: MessageStatus };

const OPENING = "hi — i'm pingu, marco's stand-in while he's compiling. ask me the small stuff.";

// Hardcoded for now — swap this for a real model call later. Everything
// below it (thinking dots, then typewriter) stays the same either way.
const QA: { q: string; a: string }[] = [
  {
    q: "dev or artist?",
    a: "both. he works as a backend engineer and makes digital art in 3D and illustration — two separate skill sets he keeps active.",
  },
  {
    q: "what do you build?",
    a: "backend APIs and services at bank scale. his last role was the layer wiring BBVA's Blue AI assistant to its LLMs, frontends and databases.",
  },
  {
    q: "llm work?",
    a: "two years of it, through mid-2026. not prompt demos — the production plumbing: APIs, services and data flow between the models and a large banking system.",
  },
  {
    q: "what do you make art with?",
    a: "Blender and 3D modeling, pixel art, digital illustration. he has also shipped Spotify campaign banners, which is art with a deadline.",
  },
  {
    q: "where are you?",
    a: "Redmond, Washington — full-time on an M.S. in Computer Science at DigiPen since mid-2026. before that: Mexico City, four years of engineering work.",
  },
  {
    q: "are you legal to hire?",
    a: "in the US on student status at DigiPen, open to internships and full-time after. native English and Spanish, C2 certified. ask him for specifics.",
  },
  {
    q: "stack?",
    a: "TypeScript, Node, Python, Java, React and Next.js; APIs, databases and scraping at volume. Blender and Tailwind on the other side of his brain.",
  },
  {
    q: "coffee or tea?",
    a: "coffee, and more of it than the doctor drew up. i get fish.",
  },
  {
    q: "can i hire you?",
    a: "yes — open to work and commissions, replies in a day or two. the contact tab has the button. i'll remind him.",
  },
];

async function getAnswer(question: string): Promise<string> {
  const hit = QA.find((item) => item.q === question);
  return hit?.a ?? "ask him directly — that one's outside my script.";
}

let nextId = 1;

export function PinguChat({ height }: { height?: number }) {
  const reduced = usePrefersReducedMotion();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, role: "bot", text: OPENING, status: "done" },
  ]);
  const [busy, setBusy] = useState(false);
  const [activeQ, setActiveQ] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const thinkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-scroll to the newest message, never let the panel itself resize.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    return () => {
      if (thinkTimer.current) clearTimeout(thinkTimer.current);
      if (typeTimer.current) clearTimeout(typeTimer.current);
    };
  }, []);

  async function ask(question: string) {
    if (busy) return;
    setBusy(true);
    setActiveQ(question);

    const userMsg: ChatMessage = { id: nextId++, role: "user", text: question, status: "done" };
    const botId = nextId++;
    setMessages((prev) => [...prev, userMsg, { id: botId, role: "bot", text: "", status: "thinking" }]);

    const answer = await getAnswer(question);

    if (reduced) {
      setMessages((prev) =>
        prev.map((m) => (m.id === botId ? { ...m, text: answer, status: "done" } : m)),
      );
      setBusy(false);
      return;
    }

    thinkTimer.current = setTimeout(() => {
      setMessages((prev) => prev.map((m) => (m.id === botId ? { ...m, status: "typing" } : m)));
      let i = 0;
      const step = () => {
        i++;
        setMessages((prev) =>
          prev.map((m) => (m.id === botId ? { ...m, text: answer.slice(0, i) } : m)),
        );
        if (i < answer.length) {
          typeTimer.current = setTimeout(step, 14);
        } else {
          setMessages((prev) => prev.map((m) => (m.id === botId ? { ...m, status: "done" } : m)));
          setBusy(false);
        }
      };
      step();
    }, 1000);
  }

  return (
    <div
      className="flex h-[460px] min-h-0 flex-col overflow-hidden rounded-[22px] border border-line bg-panel [backdrop-filter:blur(22px)] [box-shadow:var(--shadow)]"
      style={height ? { height } : undefined}
    >
      <div className="flex shrink-0 items-center gap-1.5 border-b border-line px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-line-hot" />
        <span className="h-2 w-2 rounded-full bg-line" />
        <span className="ml-1.5 font-mono text-[9px] text-muted">ask_marco.sh</span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[9px] text-accent">
          <span className="h-[5px] w-[5px] rounded-full bg-accent animate-pulse-dot" />
          pingu is online
        </span>
      </div>

      <div
        ref={listRef}
        className="pingu-scroll flex min-h-0 flex-1 flex-col gap-[9px] overflow-y-auto px-4 py-3.5"
      >
        {messages.map((m) => (
          <Bubble key={m.id} message={m} />
        ))}
      </div>

      <div className="flex shrink-0 flex-wrap gap-1.5 border-t border-line px-4 py-3">
        {QA.map(({ q }) => (
          <button
            key={q}
            type="button"
            disabled={busy}
            onClick={() => ask(q)}
            className="rounded-full border px-2.5 py-1.5 font-mono text-[9px] text-dim transition-colors disabled:cursor-default disabled:opacity-60"
            style={{
              borderColor: activeQ === q ? "var(--accent)" : "var(--line)",
              background: activeQ === q ? "var(--wash)" : "transparent",
            }}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div
          className="max-w-[78%] rounded-[14px_14px_4px_14px] border px-3 py-2 font-mono text-[11px] leading-[1.55] whitespace-pre-wrap text-ink"
          style={{ background: "var(--wash)", borderColor: "var(--line-hot)" }}
        >
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <PenguinAvatar />
      <div
        className="max-w-[78%] rounded-[14px_14px_14px_4px] px-3 py-2 font-mono text-[11px] leading-[1.55] whitespace-pre-wrap text-dim"
        style={{ background: "var(--glass-soft)" }}
      >
        {message.status === "thinking" ? (
          <ThinkingDots />
        ) : (
          <>
            {message.text}
            {message.status === "typing" ? <span className="animate-blink text-accent">▌</span> : null}
          </>
        )}
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      <span className="h-[5px] w-[5px] rounded-full bg-accent [animation:pingu-dot_1s_ease-in-out_infinite]" />
      <span className="h-[5px] w-[5px] rounded-full bg-accent [animation:pingu-dot_1s_ease-in-out_.16s_infinite]" />
      <span className="h-[5px] w-[5px] rounded-full bg-accent [animation:pingu-dot_1s_ease-in-out_.32s_infinite]" />
    </span>
  );
}

// A simple monoline penguin, just for the bot avatar.
function PenguinAvatar() {
  return (
    <span
      className="mt-0.5 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[10px] border"
      style={{ background: "var(--wash)", borderColor: "var(--line)" }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[17px] w-[17px] text-accent"
        aria-hidden="true"
      >
        <path d="M12 3c-3.3 0-5.5 2.6-5.5 6.4 0 3-.9 5-1.8 7.1-.5 1.2.2 2.5 1.5 2.5h11.6c1.3 0 2-1.3 1.5-2.5-.9-2.1-1.8-4.1-1.8-7.1C17.5 5.6 15.3 3 12 3z" />
        <path d="M9 10.2c0-1.9 1.3-3.4 3-3.4s3 1.5 3 3.4-1.3 5.6-3 5.6-3-3.7-3-5.6z" />
        <path d="M12 11.6l1.4 1.1-1.4.9-1.4-.9z" fill="currentColor" stroke="none" />
        <circle cx="10.1" cy="8.6" r=".6" fill="currentColor" stroke="none" />
        <circle cx="13.9" cy="8.6" r=".6" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}
