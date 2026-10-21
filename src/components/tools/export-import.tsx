"use client";

import { useRef, useState } from "react";

// A plain JSON download + a file picker that hands the parsed object
// back to the caller — used identically by /lift (sessions + check-ins)
// and /meal (days + custom foods) since neither has a server to back
// up to.
export function ExportImport({
  filename,
  getData,
  onImport,
}: {
  filename: string;
  getData: () => unknown;
  onImport: (data: unknown) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");

  function handleExport() {
    const blob = new Blob([JSON.stringify(getData(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setStatus("Exported.");
  }

  function handleImportClick() {
    fileRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        onImport(data);
        setStatus("Imported.");
      } catch {
        setStatus("That file wasn't valid JSON.");
      }
    };
    reader.onerror = () => setStatus("Couldn't read that file.");
    reader.readAsText(file);
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        type="button"
        onClick={handleExport}
        className="rounded-[10px] border border-line bg-glass-soft px-3 py-1.5 font-mono text-[11px] font-bold text-ink transition-colors hover:border-line-hot hover:text-accent"
      >
        export json
      </button>
      <button
        type="button"
        onClick={handleImportClick}
        className="rounded-[10px] border border-line bg-glass-soft px-3 py-1.5 font-mono text-[11px] font-bold text-ink transition-colors hover:border-line-hot hover:text-accent"
      >
        import json
      </button>
      <input ref={fileRef} type="file" accept="application/json" hidden onChange={handleFileChange} />
      {status ? <span className="font-mono text-[11px] text-muted">{status}</span> : null}
    </div>
  );
}
