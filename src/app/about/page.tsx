import { AppWindow } from "@/components/chrome/app-window";
import { AboutContent } from "@/components/about/about-content";

export default function AboutPage() {
  return (
    <AppWindow title="about.exe">
      <AboutContent />
    </AppWindow>
  );
}
