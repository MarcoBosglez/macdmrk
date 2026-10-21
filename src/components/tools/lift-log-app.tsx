"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ExportImport } from "@/components/tools/export-import";
import { localStore } from "@/lib/local-store";

// ─── Types ──────────────────────────────────────────────────────────
type Unit = "kg" | "lb";
type PlanExercise = { name: string; sets: number; reps: string };
type PlanWorkout = { name: string; day: number; ex: PlanExercise[] };
type SetEntry = { w: string; r: string; done: boolean };
type Draft = { date: string; unit: Unit; entries: Record<string, SetEntry[]> };
type Session = {
  id: string;
  workout: string;
  date: string;
  unit: Unit;
  entries: Record<string, { w: string; r: string }[]>;
  savedAt: string;
};
type Checkin = { id: string; date: string; weight: string; unit: Unit; waist: string; notes: string };

// ─── The plan ───────────────────────────────────────────────────────
const PLAN: Record<string, PlanWorkout> = {
  upperA: {
    name: "Upper A",
    day: 1,
    ex: [
      { name: "Bench press", sets: 3, reps: "6-8" },
      { name: "Row (chest-supported)", sets: 3, reps: "8-10" },
      { name: "DB shoulder press", sets: 3, reps: "8-10" },
      { name: "Lat pulldown", sets: 3, reps: "8-12" },
      { name: "Cable fly", sets: 3, reps: "10-15" },
      { name: "Lateral raise", sets: 4, reps: "12-15" },
      { name: "EZ-bar curl", sets: 4, reps: "8-12" },
      { name: "Rope pushdown", sets: 4, reps: "10-12" },
    ],
  },
  lowerA: {
    name: "Lower A",
    day: 2,
    ex: [
      { name: "Back squat", sets: 3, reps: "6-8" },
      { name: "Romanian deadlift", sets: 3, reps: "8-10" },
      { name: "Leg press", sets: 2, reps: "10-12" },
      { name: "Leg curl", sets: 3, reps: "10-12" },
      { name: "Standing calf raise", sets: 3, reps: "10-15" },
      { name: "Hanging leg raise", sets: 3, reps: "10-15" },
    ],
  },
  upperB: {
    name: "Upper B",
    day: 4,
    ex: [
      { name: "Incline DB press", sets: 3, reps: "8-10" },
      { name: "Pull-ups / pulldown", sets: 3, reps: "6-10" },
      { name: "Overhead press", sets: 3, reps: "6-8" },
      { name: "Seated cable row", sets: 3, reps: "10-12" },
      { name: "Lateral raise", sets: 4, reps: "12-20" },
      { name: "Rear-delt fly", sets: 3, reps: "12-15" },
      { name: "Incline DB curl", sets: 4, reps: "10-12" },
      { name: "OH triceps extension", sets: 4, reps: "10-12" },
      { name: "Hanging leg raise", sets: 3, reps: "10-15" },
    ],
  },
  lowerB: {
    name: "Lower B",
    day: 5,
    ex: [
      { name: "Deadlift (or hip thrust)", sets: 3, reps: "5-6" },
      { name: "Bulgarian split squat", sets: 3, reps: "8-10/leg" },
      { name: "Leg extension", sets: 3, reps: "12-15" },
      { name: "Seated leg curl", sets: 3, reps: "10-12" },
      { name: "Seated calf raise", sets: 3, reps: "12-15" },
      { name: "Cable crunch", sets: 3, reps: "10-15" },
      { name: "Hammer curl (superset)", sets: 3, reps: "10-12" },
      { name: "Rope pushdown (superset)", sets: 3, reps: "10-12" },
    ],
  },
};
const WORKOUT_KEYS = Object.keys(PLAN);
const TABS = [...WORKOUT_KEYS, "body", "plan"];
const TAB_LABEL: Record<string, string> = { body: "Body", plan: "Plan" };

// ─── Helpers ────────────────────────────────────────────────────────
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const topRep = (r: string) => parseInt(r.split("-")[1]) || 0;
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const fmtDate = (s: string) => {
  try {
    return new Date(`${s}T12:00:00`).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return s;
  }
};
function conv(w: string, from: Unit, to: Unit): string {
  if (w === "" || w == null) return "";
  const n = parseFloat(w.replace(",", "."));
  if (isNaN(n)) return w;
  if (from === to) return w;
  const v = from === "kg" ? n * 2.20462 : n / 2.20462;
  return String(Math.round(v * 10) / 10);
}
const setStr = (x: { w: string; r: string }, from: Unit, unit: Unit) =>
  (x.w ? conv(x.w, from, unit) : "BW") + "×" + (x.r || "–");

const BTN = "rounded-[10px] border border-line bg-glass-soft px-3 py-1.5 font-mono text-[11px] font-bold text-ink transition-colors hover:border-line-hot hover:text-accent";
const BTN_SOLID = "rounded-[10px] bg-accent px-4 py-2.5 font-mono text-[13px] font-bold text-bg";
const CARD = "rounded-[16px] border border-line bg-panel p-4";
const INPUT = "w-full rounded-[8px] border border-line bg-bg px-2.5 py-2 text-center font-mono text-[15px] text-ink outline-none focus:border-line-hot";

// ─── Main component ─────────────────────────────────────────────────
export function LiftLogApp() {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState("upperA");
  const [unit, setUnit] = useState<Unit>("kg");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    const wd = new Date().getDay();
    setTab(localStore.get("lift-tab", WORKOUT_KEYS.find((k) => PLAN[k].day === wd) || "upperA"));
    setUnit(localStore.get<Unit>("lift-unit", "kg"));
    setSessions(localStore.get("lift-sessions", []));
    setCheckins(localStore.get("lift-checkins", []));
    setDrafts(localStore.get("lift-draft", {}));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStore.set("lift-tab", tab);
  }, [tab, mounted]);
  useEffect(() => {
    if (mounted) localStore.set("lift-draft", drafts);
  }, [drafts, mounted]);

  const sortedSessions = (w: string) =>
    sessions
      .filter((s) => s.workout === w)
      .sort((a, b) => (b.date + b.savedAt).localeCompare(a.date + a.savedAt));

  function lastFor(w: string, exKey: string) {
    for (const s of sortedSessions(w)) {
      const e = s.entries[exKey];
      if (e && e.some((x) => x.r)) return { date: s.date, sets: e, unit: s.unit || "kg" };
    }
    return null;
  }

  function getDraft(w: string): Draft {
    if (drafts[w]) return drafts[w];
    const d: Draft = { date: today(), unit, entries: {} };
    for (const ex of PLAN[w].ex) {
      const k = slugify(ex.name);
      const last = lastFor(w, k);
      d.entries[k] = Array.from({ length: ex.sets }, (_, i) => {
        const src = last ? last.sets[i] || last.sets[0] : null;
        return { w: src ? conv(src.w || "", last!.unit as Unit, unit) : "", r: "", done: false };
      });
    }
    return d;
  }

  function updateDraft(w: string, updater: (d: Draft) => Draft) {
    setDrafts((prev) => ({ ...prev, [w]: updater(prev[w] || getDraft(w)) }));
  }

  function switchUnit(to: Unit) {
    if (to === unit) return;
    setDrafts((prev) => {
      const next: Record<string, Draft> = {};
      for (const [w, d] of Object.entries(prev)) {
        const from = d.unit || "kg";
        const entries: Record<string, SetEntry[]> = {};
        for (const [k, arr] of Object.entries(d.entries)) {
          entries[k] = arr.map((x) => ({ ...x, w: conv(x.w, from, to) }));
        }
        next[w] = { ...d, unit: to, entries };
      }
      return next;
    });
    setUnit(to);
    localStore.set("lift-unit", to);
  }

  async function saveSession(w: string) {
    const d = getDraft(w);
    const entries: Session["entries"] = {};
    let n = 0;
    for (const [k, arr] of Object.entries(d.entries)) {
      const clean = arr.map((x) => ({ w: x.w || "", r: x.r || "" }));
      if (clean.some((x) => x.r)) {
        entries[k] = clean;
        n++;
      }
    }
    if (!n) {
      setStatus("Enter reps for at least one set first.");
      return;
    }
    const doc: Session = {
      id: `${w}_${d.date}`,
      workout: w,
      date: d.date,
      unit: d.unit || unit,
      entries,
      savedAt: new Date().toISOString(),
    };
    const next = sessions.filter((s) => s.id !== doc.id).concat(doc);
    setSessions(next);
    localStore.set("lift-sessions", next);
    setDrafts((prev) => {
      const { [w]: _drop, ...rest } = prev;
      localStore.set("lift-draft", rest);
      return rest;
    });
    setStatus(`Saved ${n} exercises for ${fmtDate(d.date)}.`);
  }

  function deleteSession(id: string) {
    const next = sessions.filter((s) => s.id !== id);
    setSessions(next);
    localStore.set("lift-sessions", next);
  }
  function saveCheckin(c: Checkin) {
    const next = checkins.filter((x) => x.id !== c.id).concat(c);
    setCheckins(next);
    localStore.set("lift-checkins", next);
  }
  function deleteCheckin(id: string) {
    const next = checkins.filter((x) => x.id !== id);
    setCheckins(next);
    localStore.set("lift-checkins", next);
  }

  function handleImport(data: unknown) {
    if (!data || typeof data !== "object") return;
    const d = data as { sessions?: Session[]; checkins?: Checkin[] };
    if (Array.isArray(d.sessions)) {
      setSessions(d.sessions);
      localStore.set("lift-sessions", d.sessions);
    }
    if (Array.isArray(d.checkins)) {
      setCheckins(d.checkins);
      localStore.set("lift-checkins", d.checkins);
    }
  }

  if (!mounted) return null;

  const wd = new Date().getDay();

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto p-4 pb-28 md:p-6 md:pb-28">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="font-mono text-[11px] tracking-[0.16em] uppercase text-accent">~/ lift.log</h1>
          <p className="mt-1 text-[13px] text-dim">Saved on this device only.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/meal" className={BTN}>
            meal log →
          </Link>
          <div className="flex overflow-hidden rounded-[10px] border border-line">
            {(["kg", "lb"] as Unit[]).map((u) => (
              <button
                key={u}
                onClick={() => switchUnit(u)}
                className="px-3 py-1.5 font-mono text-[12px] font-bold transition-colors"
                style={{
                  background: unit === u ? "var(--accent)" : "transparent",
                  color: unit === u ? "var(--bg)" : "var(--muted)",
                }}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </div>

      <nav className="sticky top-0 z-[2] -mx-4 flex shrink-0 gap-1.5 overflow-x-auto px-4 py-2 md:mx-0 md:px-0">
        {TABS.map((t) => {
          const label = PLAN[t] ? PLAN[t].name : TAB_LABEL[t];
          const isToday = PLAN[t] && PLAN[t].day === wd;
          const active = t === tab;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 font-mono text-[12px] font-bold transition-colors"
              style={{
                borderColor: active ? "var(--accent)" : "var(--line)",
                background: active ? "var(--accent)" : "var(--glass-soft)",
                color: active ? "var(--bg)" : "var(--dim)",
              }}
            >
              {label}
              {isToday ? <span className="ml-1.5 font-sans text-[10px] font-normal opacity-70">today</span> : null}
            </button>
          );
        })}
      </nav>

      {PLAN[tab] ? (
        <WorkoutView
          w={tab}
          unit={unit}
          draft={getDraft(tab)}
          sortedSessions={sortedSessions(tab)}
          lastFor={lastFor}
          onDraftChange={(updater) => updateDraft(tab, updater)}
          onDeleteSession={deleteSession}
        />
      ) : tab === "body" ? (
        <BodyView checkins={checkins} unit={unit} onSave={saveCheckin} onDelete={deleteCheckin} onImport={handleImport} sessions={sessions} />
      ) : (
        <PlanView />
      )}

      {PLAN[tab] ? (
        <div className="fixed inset-x-0 bottom-0 z-[6] border-t border-line bg-panel px-4 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom,0px))] md:px-6">
          <div className="mx-auto flex max-w-[720px] items-center gap-3">
            <span className="min-h-[1.2em] flex-1 text-[13px] text-muted">{status}</span>
            <button onClick={() => saveSession(tab)} className={BTN_SOLID}>
              Save session
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ─── Workout view ───────────────────────────────────────────────────
function WorkoutView({
  w,
  unit,
  draft,
  sortedSessions,
  lastFor,
  onDraftChange,
  onDeleteSession,
}: {
  w: string;
  unit: Unit;
  draft: Draft;
  sortedSessions: Session[];
  lastFor: (w: string, k: string) => { date: string; sets: { w: string; r: string }[]; unit: string } | null;
  onDraftChange: (updater: (d: Draft) => Draft) => void;
  onDeleteSession: (id: string) => void;
}) {
  const p = PLAN[w];

  function setField(k: string, i: number, field: "w" | "r", value: string) {
    onDraftChange((d) => {
      const entries = { ...d.entries };
      const arr = entries[k].map((x, idx) => (idx === i ? { ...x, [field]: value } : x));
      entries[k] = arr;
      // carry a changed weight down to the next empty-rep sets
      if (field === "w") {
        for (let j = i + 1; j < arr.length; j++) {
          if (!arr[j].r) arr[j] = { ...arr[j], w: value };
        }
        entries[k] = arr;
      }
      return { ...d, entries };
    });
  }
  function toggleDone(k: string, i: number) {
    onDraftChange((d) => {
      const entries = { ...d.entries };
      entries[k] = entries[k].map((x, idx) => (idx === i ? { ...x, done: !x.done } : x));
      return { ...d, entries };
    });
  }
  function setDate(value: string) {
    onDraftChange((d) => ({ ...d, date: value }));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-sans text-[22px] font-bold tracking-tight text-ink">{p.name}</h2>
          <p className="text-[12.5px] text-muted">Compounds: stop ~1 rep short. Last set of isolations: to failure.</p>
        </div>
        <label className="flex items-center gap-2 font-mono text-[12px] text-muted">
          Date
          <input
            type="date"
            value={draft.date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-[8px] border border-line bg-bg px-2 py-1.5 font-mono text-[12px] text-ink"
          />
        </label>
      </div>

      <div className="flex flex-col gap-2.5">
        {p.ex.map((ex) => {
          const k = slugify(ex.name);
          const last = lastFor(w, k);
          const rows = draft.entries[k] || [];
          const top = topRep(ex.reps);
          const ready = !!(last && top && last.sets.length >= ex.sets && last.sets.slice(0, ex.sets).every((x) => parseInt(x.r) >= top));
          const complete = rows.length > 0 && rows.every((x) => x.done);
          return (
            <div key={k} className={CARD} style={{ borderColor: complete ? "var(--accent)" : undefined }}>
              <div className="flex items-baseline justify-between gap-3">
                <div className="font-sans text-[15px] font-semibold text-ink">{ex.name}</div>
                <div className="shrink-0 font-mono text-[12px] text-accent">
                  {ex.sets} × {ex.reps}
                </div>
              </div>
              <div className="mt-1 text-[12px] text-muted">
                {last ? (
                  <>
                    Last ({fmtDate(last.date)}):{" "}
                    <b className="font-mono font-medium text-ink">
                      {last.sets.map((x) => setStr(x, last.unit as Unit, unit)).join(" · ")}
                    </b>{" "}
                    {unit}
                  </>
                ) : (
                  "No sets logged yet. Find a weight that lands you at the bottom of the range."
                )}
              </div>
              {ready ? (
                <span
                  className="mt-1.5 inline-block rounded-full px-2 py-0.5 font-mono text-[11px] font-bold"
                  style={{ background: "rgba(181,83,42,0.14)", color: "#b5532a" }}
                >
                  Top of range hit. Add weight today
                </span>
              ) : null}
              <div className="mt-2.5 flex flex-col gap-1.5">
                {rows.map((x, i) => (
                  <div key={i} className="grid grid-cols-[22px_1fr_1fr_40px] items-center gap-2">
                    <div className="text-center font-mono text-[11px] text-muted">{i + 1}</div>
                    <div className="relative">
                      <input
                        inputMode="decimal"
                        value={x.w}
                        placeholder={unit}
                        onChange={(e) => setField(k, i, "w", e.target.value.trim())}
                        aria-label={`${ex.name} set ${i + 1} weight`}
                        className={INPUT}
                      />
                    </div>
                    <div className="relative">
                      <input
                        inputMode="numeric"
                        value={x.r}
                        placeholder="reps"
                        onChange={(e) => setField(k, i, "r", e.target.value.trim())}
                        aria-label={`${ex.name} set ${i + 1} reps`}
                        className={INPUT}
                      />
                    </div>
                    <button
                      onClick={() => toggleDone(k, i)}
                      aria-pressed={x.done}
                      aria-label={`Mark set ${i + 1} done`}
                      className="flex h-9 w-10 items-center justify-center rounded-[8px] border font-bold"
                      style={{
                        borderColor: x.done ? "var(--accent)" : "var(--line)",
                        background: x.done ? "var(--accent)" : "var(--bg)",
                        color: x.done ? "var(--bg)" : "var(--muted)",
                      }}
                    >
                      ✓
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <section className="mt-3">
        <h3 className="mb-2 font-mono text-[11px] tracking-[0.16em] uppercase text-muted">Past {p.name} sessions</h3>
        {sortedSessions.length === 0 ? (
          <div className="rounded-[12px] border border-dashed border-line px-3.5 py-3 text-[13px] text-dim">
            Nothing saved yet. Fill in your sets above and tap <b>Save session</b>. Next time, your last numbers
            show on each exercise.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {sortedSessions.slice(0, 12).map((s) => (
              <SessionDetails key={s.id} s={s} w={w} unit={unit} onDelete={onDeleteSession} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SessionDetails({
  s,
  w,
  unit,
  onDelete,
}: {
  s: Session;
  w: string;
  unit: Unit;
  onDelete: (id: string) => void;
}) {
  const [armed, setArmed] = useState(false);
  const count = Object.values(s.entries || {}).filter((e) => e.some((x) => x.r)).length;
  return (
    <details className={`${CARD} group`}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-sans text-[14px] font-semibold text-ink">
        {fmtDate(s.date)}
        <span className="font-mono text-[12px] font-normal text-muted">{count} exercises</span>
      </summary>
      <div className="mt-2 flex flex-col">
        {PLAN[w].ex.map((ex) => {
          const e = s.entries[slugify(ex.name)];
          if (!e || !e.some((x) => x.r)) return null;
          return (
            <div key={ex.name} className="flex justify-between gap-3 border-t border-dashed border-line-soft py-1 text-[12.5px] first:border-t-0">
              <span className="text-dim">{ex.name}</span>
              <span className="font-mono text-ink">
                {e.filter((x) => x.r).map((x) => setStr(x, (s.unit || "kg") as Unit, unit)).join(" · ")} {unit}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-end">
        <button
          onClick={() => (armed ? onDelete(s.id) : setArmed(true))}
          className="font-mono text-[11px] text-muted hover:text-accent"
        >
          {armed ? "Tap again to delete" : "Delete session"}
        </button>
      </div>
    </details>
  );
}

// ─── Body view ──────────────────────────────────────────────────────
function BodyView({
  checkins,
  unit,
  onSave,
  onDelete,
  onImport,
  sessions,
}: {
  checkins: Checkin[];
  unit: Unit;
  onSave: (c: Checkin) => void;
  onDelete: (id: string) => void;
  onImport: (data: unknown) => void;
  sessions: Session[];
}) {
  const [date, setDate] = useState(today());
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [notes, setNotes] = useState("");
  const [formStatus, setFormStatus] = useState("");

  const rows = useMemo(() => [...checkins].sort((a, b) => b.date.localeCompare(a.date)), [checkins]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || (!weight && !waist && !notes)) {
      setFormStatus("Add a weight, waist or note.");
      return;
    }
    onSave({ id: `c_${date}`, date, weight, unit, waist, notes });
    setWeight("");
    setWaist("");
    setNotes("");
    setFormStatus("Saved.");
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="font-sans text-[22px] font-bold tracking-tight text-ink">Body check-ins</h2>
        <p className="text-[12.5px] text-muted">Weigh at the gym 1–2×/week, same time of day. Waist at the navel, weekly.</p>
      </div>

      <form onSubmit={submit} className={`${CARD} flex flex-col gap-3`}>
        <div className="grid grid-cols-2 gap-2.5">
          <label className="flex flex-col gap-1 text-[12px] text-muted">
            Date
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="rounded-[8px] border border-line bg-bg px-2.5 py-2 font-mono text-[13px] text-ink" />
          </label>
          <label className="flex flex-col gap-1 text-[12px] text-muted">
            Weight ({unit})
            <input inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder={unit === "kg" ? "70.5" : "155"} className="rounded-[8px] border border-line bg-bg px-2.5 py-2 font-mono text-[13px] text-ink" />
          </label>
          <label className="flex flex-col gap-1 text-[12px] text-muted">
            Waist (cm)
            <input inputMode="decimal" value={waist} onChange={(e) => setWaist(e.target.value)} placeholder="78" className="rounded-[8px] border border-line bg-bg px-2.5 py-2 font-mono text-[13px] text-ink" />
          </label>
          <label className="flex flex-col gap-1 text-[12px] text-muted">
            Notes
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="photo taken, felt good…" className="rounded-[8px] border border-line bg-bg px-2.5 py-2 text-[13px] text-ink" />
          </label>
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" className={BTN_SOLID}>
            Add check-in
          </button>
          <span className="text-[13px] text-muted">{formStatus}</span>
        </div>
      </form>

      <div className={CARD}>
        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono text-[13px]">
              <thead>
                <tr className="text-left">
                  <th className="border-b border-line pb-2 text-[11px] font-semibold tracking-wide text-muted uppercase">Date</th>
                  <th className="border-b border-line pb-2 text-[11px] font-semibold tracking-wide text-muted uppercase">Weight</th>
                  <th className="border-b border-line pb-2 text-[11px] font-semibold tracking-wide text-muted uppercase">Waist</th>
                  <th className="border-b border-line pb-2 text-[11px] font-semibold tracking-wide text-muted uppercase">Notes</th>
                  <th className="border-b border-line pb-2" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <CheckinRow key={r.id} r={r} unit={unit} onDelete={onDelete} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[13.5px] text-dim">No check-ins yet. Goal for Phase 1: about +0.25–0.5 kg per month toward ~73 kg.</p>
        )}
      </div>

      <div className={`${CARD} flex flex-col gap-2`}>
        <h3 className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted">Backup</h3>
        <ExportImport
          filename="lift-log"
          getData={() => ({ sessions, checkins })}
          onImport={onImport}
        />
      </div>
    </div>
  );
}

function CheckinRow({ r, unit, onDelete }: { r: Checkin; unit: Unit; onDelete: (id: string) => void }) {
  const [armed, setArmed] = useState(false);
  return (
    <tr>
      <td className="border-b border-line py-1.5 pr-2">{fmtDate(r.date)}</td>
      <td className="border-b border-line py-1.5 pr-2">{r.weight ? `${conv(r.weight, (r.unit || "kg") as Unit, unit)} ${unit}` : "–"}</td>
      <td className="border-b border-line py-1.5 pr-2">{r.waist ? `${r.waist} cm` : "–"}</td>
      <td className="border-b border-line py-1.5 pr-2 font-sans text-ink">{r.notes || ""}</td>
      <td className="border-b border-line py-1.5">
        <button onClick={() => (armed ? onDelete(r.id) : setArmed(true))} className="font-sans text-muted hover:text-accent" aria-label="Delete">
          {armed ? "sure?" : "✕"}
        </button>
      </td>
    </tr>
  );
}

// ─── Plan view ──────────────────────────────────────────────────────
function PlanView() {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="font-sans text-[22px] font-bold tracking-tight text-ink">The plan</h2>
        <p className="text-[12.5px] text-muted">Phase 1: lean gain 70–71 → ~73 kg over 4–6 months. Phase 2 (optional): 6–8 week lean-out.</p>
      </div>

      <div className={CARD}>
        <h3 className="mb-2 font-mono text-[11px] tracking-[0.16em] uppercase text-muted">Daily targets</h3>
        <SimpleTable
          head={["", "Training day", "Rest day"]}
          rows={[
            ["Calories", "~2,700 kcal", "~2,550 kcal"],
            ["Protein", "140–160 g", "140–160 g"],
          ]}
        />
      </div>

      <div className={CARD}>
        <h3 className="mb-2 font-mono text-[11px] tracking-[0.16em] uppercase text-muted">Meals (weigh meat raw, rice cooked)</h3>
        <SimpleTable
          head={["Meal", "Training day", "Rest day"]}
          rows={[
            ["Breakfast", "4 eggs, 2 slices bread, 150 g Greek yogurt + 75 g blueberries, OJ", "Same"],
            ["Lunch", "200 g protein + 300 g rice (or 400 g potatoes) + veg + 10 g olive oil", "200 g protein + 250 g rice + veg"],
            ["Snack", "200 g Greek yogurt + banana, or protein bar + fruit", "Same"],
            ["Dinner", "200 g protein + 250 g rice + veg", "200 g protein + 200 g rice + extra veg"],
          ]}
        />
      </div>

      <div className={CARD}>
        <h3 className="mb-2 font-mono text-[11px] tracking-[0.16em] uppercase text-muted">Every 4 weeks</h3>
        <SimpleTable
          head={["What you see", "What to do"]}
          rows={[
            ["Weight flat or under 0.25 kg/month", "Add 50 g rice to lunch and dinner"],
            ["Up 0.25–0.5 kg/month, waist steady", "Change nothing"],
            ["Over 0.5 kg/month, waist growing", "Remove 50 g rice from dinner"],
          ]}
        />
      </div>

      <div className={CARD}>
        <h3 className="mb-2 font-mono text-[11px] tracking-[0.16em] uppercase text-muted">Progressive overload</h3>
        <ol className="list-decimal space-y-1.5 pl-5 text-[13.5px] text-dim">
          <li>Use a weight that lands you at the bottom of the rep range.</li>
          <li>Add reps each session until you hit the top of the range on all sets.</li>
          <li>Then add the smallest jump (+2.5 kg / 5 lb on a barbell, next dumbbell, small plate on machines) and start at the bottom again.</li>
          <li>Every 6–8 weeks, take an easy week with half the sets.</li>
        </ol>
        <p className="mt-2 text-[13px] text-muted">
          Example: bench 3 × 6–8 at 50 kg → 8/7/6 → 8/8/7 → 8/8/8 → next session 52.5 kg.
        </p>
      </div>

      <div className={CARD}>
        <h3 className="mb-2 font-mono text-[11px] tracking-[0.16em] uppercase text-muted">Week</h3>
        <SimpleTable
          head={[]}
          rows={[
            ["Mon", "Upper A · 2:00–3:30"],
            ["Tue", "Lower A · 3:30–5:00"],
            ["Wed", "Rest"],
            ["Thu", "Upper B · 3:30–5:00"],
            ["Fri", "Lower B · 3:00–4:30"],
            ["Sat", "Optional Muay Thai / MMA"],
            ["Sun", "Rest · meal prep"],
          ]}
        />
        <p className="mt-2 text-[13px] text-muted">3-day weeks: Mon, Tue, Thu, and keep the rotation going.</p>
      </div>
    </div>
  );
}

function SimpleTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13.5px]">
        {head.length ? (
          <thead>
            <tr>
              {head.map((h, i) => (
                <th key={i} className="border-b border-line py-1.5 pr-3 text-left text-[11px] font-semibold tracking-wide text-muted uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="border-b border-line py-1.5 pr-3 align-top text-dim first:text-ink first:font-medium">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
