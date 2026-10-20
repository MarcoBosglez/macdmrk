import { ILLUSTRATIONS } from "@/lib/data/illustrations";
import { ArtGrid } from "@/components/gallery/art-grid";
import { MonoTheme } from "@/components/gallery/mono-theme";

export default function GalleryPage() {
  return (
    <>
      <MonoTheme />
      <ArtGrid illustrations={ILLUSTRATIONS} />
    </>
  );
}
