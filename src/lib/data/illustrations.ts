import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

export type Illustration = {
  slug: string;
  caption: string;
  hue: number;
  // Intrinsic pixel size of the actual image file — lets the masonry
  // gallery size each tile by its real aspect ratio instead of a
  // fixed, hand-picked height.
  width: number;
  height: number;
  // Path under /public, e.g. "/illustrations/sketch-041.jpg". Omit to
  // fall back to the generated placeholder gradient.
  image?: string;
  // Freeform blurb shown under the piece in both the gallery lightbox
  // and its shareable page (e.g. "graphite study, ~2hrs"). Optional —
  // pieces without one just skip that line.
  description?: string;
  // Shown on the right of each gallery frame's caption row; also what
  // the medium filter chips are built from. Defaults to "digital".
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

// Placeholder-gradient color for the rare case an entry has no
// resolvable image — deterministic so a given filename always gets
// the same hue rather than a random one on every rebuild.
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
    // Newest first, so dropping in a new piece puts it at the front of
    // the gallery instead of burying it alphabetically.
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  return files.map(({ name, filePath }) => {
    const slug = slugify(name.replace(/\.[^.]+$/, ""));

    let width = 1000;
    let height = 1000;
    try {
      // image-size's types want a Uint8Array backed by a plain
      // ArrayBuffer; Buffer is technically Uint8Array<ArrayBufferLike>
      // (it permits SharedArrayBuffer), so wrap it to satisfy that.
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
