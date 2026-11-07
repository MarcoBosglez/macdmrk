import fs from "node:fs";
import path from "node:path";
import { AboutContent } from "@/components/about/about-content";

// The cutout photo isn't dropped in yet — checked here (a server
// component) since about-content.tsx is a client component and can't
// use node:fs itself.
function hasCoverPhoto() {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", "images", "marco-cutout.png"));
  } catch {
    return false;
  }
}

export default function AboutPage() {
  return <AboutContent coverPhotoReady={hasCoverPhoto()} />;
}
