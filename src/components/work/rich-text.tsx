"use client";

import type { ReactNode } from "react";
import { useSound } from "@/components/providers/sound-provider";

// The copy in lib/data/projects.ts is plain strings, so this is the
// whole "markup language" it gets:
//   \n         starts a new paragraph
//   "- item"   at the start of a line makes a bullet list
//   https://…  becomes a link
//   [text](https://…)  a link that shows `text` instead of the URL
//   **text**   bold
//   ~~text~~   strikethrough
//   (bold/strikethrough can wrap links and each other: **~~old~~ new**)
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
// Alternatives, in priority order: **bold**, ~~strike~~, [label](url),
// bare url, reaction. Bold/strike are lazy (.+?) so two on one line
// stay separate, and their insides are formatted again recursively.
const INLINE = new RegExp(
  `\\*\\*(.+?)\\*\\*|~~(.+?)~~|\\[([^\\]]+)\\]\\((https?://[^\\s)]+)\\)|(https?://[^\\s)]+)|(^|[\\s(])(${Object.keys(REACTIONS).map(escapeRegExp).join("|")})(?=$|[\\s.,!?)])`,
  "g"
);

/** Links and reactions only — for one-liners and text inside other inline markup. */
export function InlineText({ text }: { text: string }) {
  const { playClick } = useSound();
  const parts: ReactNode[] = [];
  let cursor = 0;

  const link = (key: number, href: string, label: ReactNode) => (
    <a
      key={key}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => playClick("nav")}
      className="text-accent underline underline-offset-2 [overflow-wrap:anywhere] hover:brightness-110"
    >
      {label}
    </a>
  );

  Array.from(text.matchAll(INLINE)).forEach((match) => {
    const [whole, bold, strike, label, labelUrl, rawUrl, before = "", reaction] = match;
    const index = match.index ?? 0;

    if (bold) {
      parts.push(
        text.slice(cursor, index),
        <strong key={index} className="font-bold">
          <InlineText text={bold} />
        </strong>
      );
      cursor = index + whole.length;
    } else if (strike) {
      parts.push(
        text.slice(cursor, index),
        <s key={index} className="opacity-75">
          <InlineText text={strike} />
        </s>
      );
      cursor = index + whole.length;
    } else if (label && labelUrl) {
      parts.push(text.slice(cursor, index), link(index, labelUrl, <InlineText text={label} />));
      cursor = index + whole.length;
    } else if (rawUrl) {
      // Sentence punctuation straight after a URL isn't part of it.
      const url = rawUrl.replace(/[.,!?;:'"]+$/, "");
      parts.push(text.slice(cursor, index), link(index, url, url));
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
export function RichText({
  text,
  className = "",
  style,
  lead,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  lead?: ReactNode;
}) {
  const blocks = parseBlocks(text);
  if (lead && blocks[0]?.kind !== "paragraph") blocks.unshift({ kind: "paragraph", text: "" });

  return (
    <div className={`flex flex-col gap-2 ${className}`} style={style}>
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
