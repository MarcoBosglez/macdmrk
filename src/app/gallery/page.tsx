import { ILLUSTRATIONS } from "@/lib/data/illustrations";
import { ArtGrid } from "@/components/gallery/art-grid";

export default function GalleryPage() {
  return <ArtGrid illustrations={ILLUSTRATIONS} />;
}
