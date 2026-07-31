import { ILLUSTRATIONS } from "@/lib/data/illustrations";
import { AppWindow } from "@/components/chrome/app-window";
import { ArtGrid } from "@/components/gallery/art-grid";

export default function GalleryPage() {
  return (
    <AppWindow title="gallery.exe">
      <ArtGrid illustrations={ILLUSTRATIONS} />
    </AppWindow>
  );
}
