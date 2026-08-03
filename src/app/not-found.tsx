import { AppWindow } from "@/components/chrome/app-window";
import { NotFoundContent } from "@/components/chrome/not-found-content";

// Next.js renders this automatically for any unmatched route, or
// anywhere in the app that calls notFound() (see gallery/[slug] and
// work/[slug]) — it swaps in for the page, but stays inside the root
// layout, so the usual top bar / window chrome still shows around it.
export default function NotFound() {
  return (
    <AppWindow title="404.exe">
      <NotFoundContent />
    </AppWindow>
  );
}
