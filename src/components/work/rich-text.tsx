"use client";

import type { ReactNode } from "react";
import { useSound } from "@/components/providers/sound-provider";

// The copy in lib/data/projects.ts is plain strings, so this is the
// whole "markup language" it gets:
//   \n         starts a new paragraph
//   "- item"   at the start of a line makes a bullet list
//   https://…  becomes a link
//   <3, ^_^ …  any key below, as its own word, gets its colour

// Same candy colours as the project page's terminal accents.
const REACTIONS: Record<string, string> = {
  "<3": "#ff8a7a",
  "^_^": "#ffb347",
  ">_<": "#ffb347",
  ":)": "#ffb347",
  ":D": "#ffb347",
  xD: "#c792ea",
  "o_O": "#c792ea",
  "T_T": "#7fb2ff",
};

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Reactions must stand alone so "n<3" or the ":/" in a URL don't match.
// No lookbehind here on purpose: Safari before 16.4 throws on it at
// parse time, which would take the whole bundle down with it.
const INLINE = new RegExp(
  `(https?://[^\\s)]+)|(^|[\\s(])(${Object.keys(REACTIONS).map(escapeRegExp).join("|")})(?=$|[\\s.,!?)])`,
  "g"
);

/** Links and reactions only — for one-liners and text inside other inline markup. */
export function InlineText({ text }: { text: string }) {
  const { playClick } = useSound();
  const parts: ReactNode[] = [];
  let cursor = 0;

  Array.from(text.matchAll(INLINE)).forEach((match) => {
    const [whole, rawUrl, before = "", reaction] = match;
    const index = match.index ?? 0;

    if (rawUrl) {
      // Sentence punctuation straight after a URL isn't part of it.
      const url = rawUrl.replace(/[.,!?;:'"]+$/, "");
      parts.push(
        text.slice(cursor, index),
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => playClick("nav")}
          className="text-accent underline underline-offset-2 [overflow-wrap:anywhere] hover:brightness-110"
        >
          {url}
        </a>
      );
      cursor = index + url.length;
    } else {
      parts.push(
        text.slice(cursor, index) + before,
        // Decorative: a screen reader would read "<3" as "less than three".
        <span key={index} aria-hidden="true" className="whitespace-nowrap" style={{ color: REACTIONS[reaction] }}>
          {reaction}
        </span>
      );
      cursor = index + whole.length;
    }
  });

  parts.push(text.slice(cursor));
  return <>{parts}</>;
}

type Block = { kind: "paragraph"; text: string } | { kind: "list"; items: string[] };

function parseBlocks(text: string) {
  const blocks: Block[] = [];
  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    const bullet = line.match(/^-\s+(.*)$/);
    const last = blocks[blocks.length - 1];
    if (!bullet) blocks.push({ kind: "paragraph", text: line });
    else if (last?.kind === "list") last.items.push(bullet[1]);
    else blocks.push({ kind: "list", items: [bullet[1]] });
  }
  return blocks;
}

/**
 * A block of prose. Renders a <div>, not a <p>, since it can contain
 * paragraphs and lists. `lead` is inline markup placed at the start of
 * the first paragraph, e.g. a "fix:" label.
 */
export function RichText({ text, className = "", lead }: { text: string; className?: string; lead?: ReactNode }) {
  const blocks = parseBlocks(text);
  if (lead && blocks[0]?.kind !== "paragraph") blocks.unshift({ kind: "paragraph", text: "" });

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {blocks.map((block, i) =>
        block.kind === "paragraph" ? (
          <p key={i}>
            {i === 0 ? lead : null}
            <InlineText text={block.text} />
          </p>
        ) : (
          <ul key={i} className="flex flex-col gap-1">
            {block.items.map((item, j) => (
              <li key={j} className="flex gap-2">
                <span aria-hidden="true" className="shrink-0 text-accent">
                  -
                </span>
                <span className="min-w-0">
                  <InlineText text={item} />
                </span>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}
