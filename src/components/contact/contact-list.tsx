"use client";

import { useLocale } from "@/components/providers/locale-provider";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3.5 border-t border-border py-3 font-mono text-[13px] first:border-t-0 first:pt-0">
      <span className="w-24 shrink-0 text-muted">{label}</span>
      <span>{value}</span>
    </div>
  );
}

export function ContactList() {
  const { t } = useLocale();

  return (
    <div className="flex h-full max-w-[520px] flex-col overflow-y-auto p-6 md:p-10">
      <div className="mb-2 font-mono text-[13px] text-mint">~/ cat contact.txt</div>
      <Row label={t.contact.emailLabel} value="mark.bosglez@gmail.com" />
      <Row label={t.contact.instagramLabel} value="Personal: @marcobglz" />
      <Row label={t.contact.instagramLabel} value="Art Account: @macdmrk" />
      <Row label={t.contact.linkedinLabel} value="in/marco-bosquez-5580271a1" />
      <Row label={t.contact.githubLabel} value="@MarcoBosglez" />
    </div>
  );
}
