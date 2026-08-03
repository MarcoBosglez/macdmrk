import { AppWindow } from "@/components/chrome/app-window";
import { ContactIntro } from "@/components/contact/contact-intro";
import { ContactForm } from "@/components/contact/contact-form";

export default function ContactPage() {
  return (
    <AppWindow title="contact.exe">
      <div className="flex h-full flex-col overflow-y-auto md:flex-row md:overflow-hidden">
        <ContactIntro />
        <ContactForm />
      </div>
    </AppWindow>
  );
}
