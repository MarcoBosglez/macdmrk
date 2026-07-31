import { AppWindow } from "@/components/chrome/app-window";
import { FaqAccordion } from "@/components/faq/faq-accordion";

export default function FaqPage() {
  return (
    <AppWindow title="faq.exe">
      <FaqAccordion />
    </AppWindow>
  );
}
