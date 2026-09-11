import { NotFoundContent } from "@/components/chrome/not-found-content";

// Next.js renders this for any unmatched route, or anywhere the app
// calls notFound() (see work/[slug] and gallery/[slug]).
export default function NotFound() {
  return <NotFoundContent />;
}
