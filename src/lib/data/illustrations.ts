import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

export type Illustration = {
  slug: string;
  caption: string;
  hue: number;
  width: number;
  height: number;
  image?: string;
  description?: string;
  medium: string;
};

// The gallery scans public/illustrations at build time — drop an image
// in that folder and it appears (slug, caption and real pixel size all
// derived from the file). The two maps below are the only hand-authored
// bits, keyed by the auto-generated slug: an optional one-line blurb,
// and the medium label.
const DESCRIPTIONS: Record<string, string> = {};

const MEDIUMS: Record<string, string> = {
  "angel-painting": "painting",
  "august-practice": "painting",
  "beautiful-tree": "painting",
  grace: "portrait",
  "long-haired": "portrait",
  portrait: "portrait",
  him: "oc",
  hole: "concept",
  "july-practice": "painting",
  magic: "concept",
  "portrait-girl": "portrait",
  tomato: "painting",
  "angel-born-in-hell": "concept",
  middlefinger: "portrait",
  "roses": "concept",
  soldier: "portrait",
};

const ILLUSTRATIONS_DIR = path.join(process.cwd(), "public", "illustrations");
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Placeholder-gradient color for edge case where an entry has no image
function hueFromString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  return hash % 360;
}

function readIllustrations(): Illustration[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(ILLUSTRATIONS_DIR, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = entries
    .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => {
      const filePath = path.join(ILLUSTRATIONS_DIR, entry.name);
      return { name: entry.name, filePath, mtimeMs: fs.statSync(filePath).mtimeMs };
    })
    // Newest first
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  const seenSlugs = new Map<string, number>();

  return files.map(({ name, filePath }) => {
    const baseSlug = slugify(name.replace(/\.[^.]+$/, ""));
    const seenCount = seenSlugs.get(baseSlug) ?? 0;
    seenSlugs.set(baseSlug, seenCount + 1);
    // Two source filenames can slugify to the same string (e.g. "him.png"
    // and "him_.png" both become "him") — slug doubles as the id used to
    // look up/open a specific illustration, so a collision would make one
    // of them unreachable. Suffix repeats to keep every slug unique.
    const slug = seenCount === 0 ? baseSlug : `${baseSlug}-${seenCount + 1}`;

    let width = 1000;
    let height = 1000;
    try {
      const dimensions = imageSize(new Uint8Array(fs.readFileSync(filePath)));
      width = dimensions.width;
      height = dimensions.height;
    } catch (err) {
      console.warn(`illustrations: couldn't read dimensions for ${name}`, err);
    }

    return {
      slug,
      caption: name,
      hue: hueFromString(name),
      width,
      height,
      image: `/illustrations/${encodeURIComponent(name)}`,
      description: DESCRIPTIONS[slug] ?? "",
      medium: MEDIUMS[slug] ?? "digital",
    };
  });
}

export const ILLUSTRATIONS: Illustration[] = readIllustrations();
