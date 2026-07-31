import { AppWindow } from "@/components/chrome/app-window";
import { ContactList } from "@/components/contact/contact-list";

export default function ContactPage() {
  return (
    <AppWindow title="contact.exe">
      <ContactList />
    </AppWindow>
  );
}
