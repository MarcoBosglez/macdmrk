"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { ExportImport } from "@/components/tools/export-import";
import { localStore } from "@/lib/local-store";

// ─── Types ──────────────────────────────────────────────────────────
type PerMode = "100g" | "unit";
type MealKey = "breakfast" | "lunch" | "snack" | "dinner";
type Food = { id: string; name: string; per: PerMode; kcal: number; prot: number; mine?: boolean };
type DayItem = { id: string; meal: MealKey; name: string; amt: string; per: PerMode; kcal: number; prot: number };
type Day = { date: string; items: DayItem[]; training?: boolean };

// ─── Plan ───────────────────────────────────────────────────────────
const TARGET = {
  training: { kcal: 2700, prot: [140, 160] as [number, number] },
  rest: { kcal: 2550, prot: [140, 160] as [number, number] },
};
const TRAIN_DAYS = [1, 2, 4, 5]; // Mon Tue Thu Fri
const MEALS: { key: MealKey; label: string; guide: string }[] = [
  { key: "breakfast", label: "Breakfast", guide: "4 eggs, 2 slices bread, 150 g yogurt + 75 g blueberries, OJ" },
  { key: "lunch", label: "Lunch", guide: "200 g raw protein + 300 g cooked rice + veg (rest day: 250 g rice)" },
  { key: "snack", label: "Snack", guide: "200 g Greek yogurt + banana, or protein bar + fruit" },
  { key: "dinner", label: "Dinner", guide: "200 g raw protein + 250 g cooked rice + veg (rest day: 200 g rice)" },
];
const LIB_RAW: [string, PerMode, number, number][] = [
  ["Chicken breast (raw)", "100g", 120, 22.5],
  ["Chicken thigh, skinless (raw)", "100g", 144, 19.7],
  ["Ground beef 90/10 (raw)", "100g", 176, 20],
  ["Ground sirloin 90/10 (raw)", "100g", 176, 20],
  ["Ground beef 80/20 (raw)", "100g", 254, 17.2],
  ["Salmon (raw)", "100g", 208, 20.4],
  ["Tilapia (raw)", "100g", 96, 20.1],
  ["Tuna, canned in water (drained)", "100g", 116, 25.5],
  ["Egg, large", "unit", 72, 6.3],
  ["Egg whites", "100g", 52, 10.9],
  ["White rice (cooked)", "100g", 130, 2.7],
  ["Brown rice (cooked)", "100g", 123, 2.7],
  ["Pasta (cooked)", "100g", 158, 5.8],
  ["Potatoes, gold (raw)", "100g", 77, 2],
  ["Sweet potato (raw)", "100g", 86, 1.6],
  ["Oats (dry)", "100g", 379, 13.2],
  ["Bread slice", "unit", 80, 4],
  ["Corn tortilla", "unit", 52, 1.4],
  ["Flour tortilla (8 in)", "unit", 146, 3.9],
  ["Greek yogurt, plain nonfat", "100g", 59, 10.3],
  ["Cottage cheese 2%", "100g", 81, 10.5],
  ["Milk 2%", "100g", 50, 3.3],
  ["Whey protein scoop", "unit", 120, 24],
  ["Protein bar (check label)", "unit", 200, 20],
  ["Banana, medium", "unit", 105, 1.3],
  ["Apple, medium", "unit", 95, 0.5],
  ["Blueberries", "100g", 57, 0.7],
  ["Orange juice", "100g", 45, 0.7],
  ["Black beans (canned, drained)", "100g", 91, 6],
  ["Mixed vegetables (frozen)", "100g", 65, 2.9],
  ["Broccoli", "100g", 34, 2.8],
  ["Carrot", "100g", 41, 0.9],
  ["Zucchini", "100g", 17, 1.2],
  ["Spinach", "100g", 23, 2.9],
  ["Avocado", "100g", 160, 2],
  ["Olive oil", "100g", 884, 0],
  ["Peanut butter", "100g", 588, 25],
  ["Butter", "100g", 717, 0.9],
  ["Cheddar cheese", "100g", 403, 24.9],
  ["Ragu / tomato pasta sauce", "100g", 70, 1.5],
  ["Salsa", "100g", 36, 1.5],
];
const LIB: Food[] = LIB_RAW.map(([name, per, kcal, prot]) => ({
  id: `lib-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  name,
  per,
  kcal,
  prot,
}));

// ─── Helpers ────────────────────────────────────────────────────────
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parseISO = (s: string) => new Date(`${s}T12:00:00`);
const addDays = (s: string, n: number) => {
  const d = parseISO(s);
  d.setDate(d.getDate() + n);
  return iso(d);
};
const fmtDay = (s: string) => {
  const t = iso(new Date());
  if (s === t) return "Today";
  if (s === addDays(t, -1)) return "Yesterday";
  try {
    return parseISO(s).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  } catch {
    return s;
  }
};
const r0 = (n: number) => Math.round(n);
const r1 = (n: number) => Math.round(n * 10) / 10;
const uid8 = () => Math.random().toString(36).slice(2, 10);
function calc(f: Food, amt: string) {
  const a = parseFloat(amt.replace(",", ".")) || 0;
  const m = f.per === "100g" ? a / 100 : a;
  return { kcal: f.kcal * m, prot: f.prot * m };
}
const sum = (items: DayItem[]) => items.reduce((a, x) => ({ kcal: a.kcal + (x.kcal || 0), prot: a.prot + (x.prot || 0) }), { kcal: 0, prot: 0 });

const BTN = "rounded-[10px] border border-line bg-glass-soft px-3 py-1.5 font-mono text-[11px] font-bold text-ink transition-colors hover:border-line-hot hover:text-accent";
const BTN_SOLID = "rounded-[10px] bg-accent px-3.5 py-2 font-mono text-[12px] font-bold text-bg";
const CARD = "rounded-[16px] border border-line bg-panel p-4 [backdrop-filter:blur(18px)]";
const PROT_COLOR = "#b5532a";

// ─── Main component ─────────────────────────────────────────────────
export function MealLogApp() {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<"day" | "week" | "foods">("day");
  const [date, setDate] = useState("");
  const [days, setDays] = useState<Record<string, Day>>({});
  const [myFoods, setMyFoods] = useState<Food[]>([]);
  const [open, setOpen] = useState<MealKey | null>(null);
  const [pick, setPick] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [custom, setCustom] = useState(false);

  useEffect(() => {
    setTab(localStore.get("meal-tab", "day"));
    setDate(iso(new Date()));
    setDays(localStore.get("meal-days", {}));
    setMyFoods(localStore.get("meal-foods", []));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStore.set("meal-tab", tab);
  }, [tab, mounted]);

  function closeSheet() {
    setOpen(null);
    setPick(null);
    setQ("");
    setCustom(false);
  }

  function ensureDay(d: string): Day {
    return days[d] || { date: d, items: [] };
  }
  function saveDay(d: string, next: Day) {
    const nextDays = { ...days, [d]: next };
    setDays(nextDays);
    localStore.set("meal-days", nextDays);
  }
  function isTraining(d: string) {
    const day = days[d];
    if (day && typeof day.training === "boolean") return day.training;
    return TRAIN_DAYS.includes(parseISO(d).getDay());
  }
  function lastMeal(meal: MealKey, before: string) {
    const keys = Object.keys(days).filter((k) => k < before).sort().reverse();
    for (const k of keys) {
      const it = (days[k].items || []).filter((x) => x.meal === meal);
      if (it.length) return { date: k, items: it };
    }
    return null;
  }
  const allFoods = useMemo(() => [...myFoods.map((f) => ({ ...f, mine: true })), ...LIB], [myFoods]);

  function saveFood(f: Food) {
    const next = myFoods.filter((x) => x.id !== f.id).concat(f);
    setMyFoods(next);
    localStore.set("meal-foods", next);
  }
  function deleteFood(id: string) {
    const next = myFoods.filter((x) => x.id !== id);
    setMyFoods(next);
    localStore.set("meal-foods", next);
  }

  function addPick(amt: string) {
    const f = allFoods.find((x) => x.id === pick);
    if (!f || !open || !(parseFloat(amt) > 0)) return false;
    const c = calc(f, amt);
    const day = ensureDay(date);
    saveDay(date, { ...day, items: [...day.items, { id: uid8(), meal: open, name: f.name, amt, per: f.per, kcal: r1(c.kcal), prot: r1(c.prot) }] });
    closeSheet();
    return true;
  }
  function addCustom(input: { name: string; amt: string; per: PerMode; kcal: number; prot: number; keep: boolean }) {
    if (!open || !input.name || !(parseFloat(input.amt) > 0)) return false;
    const food: Food = { id: `my-${uid8()}`, name: input.name, per: input.per, kcal: input.kcal, prot: input.prot };
    const c = calc(food, input.amt);
    const day = ensureDay(date);
    saveDay(date, { ...day, items: [...day.items, { id: uid8(), meal: open, name: input.name, amt: input.amt, per: input.per, kcal: r1(c.kcal), prot: r1(c.prot) }] });
    if (input.keep) saveFood(food);
    closeSheet();
    return true;
  }
  function removeItem(id: string) {
    const day = ensureDay(date);
    saveDay(date, { ...day, items: day.items.filter((x) => x.id !== id) });
  }
  function repeatMeal(meal: MealKey) {
    const prev = lastMeal(meal, date);
    if (!prev) return;
    const day = ensureDay(date);
    saveDay(date, { ...day, items: [...day.items, ...prev.items.map((x) => ({ ...x, id: uid8() }))] });
  }
  function setTrainingOverride(v: boolean) {
    saveDay(date, { ...ensureDay(date), training: v });
  }

  function handleImport(data: unknown) {
    if (!data || typeof data !== "object") return;
    const d = data as { days?: Record<string, Day>; myFoods?: Food[] };
    if (d.days && typeof d.days === "object") {
      setDays(d.days);
      localStore.set("meal-days", d.days);
    }
    if (Array.isArray(d.myFoods)) {
      setMyFoods(d.myFoods);
      localStore.set("meal-foods", d.myFoods);
    }
  }

  if (!mounted) return null;

  const day = days[date] || { date, items: [] };
  const training = isTraining(date);
  const targets = training ? TARGET.training : TARGET.rest;
  const totals = sum(day.items || []);

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto p-4 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="font-mono text-[11px] tracking-[0.16em] uppercase text-accent">~/ meal.log</h1>
          <p className="mt-1 text-[13px] text-dim">Saved on this device only.</p>
        </div>
        <Link href="/lift" className={BTN}>
          lift log →
        </Link>
      </div>

      <nav className="flex gap-1.5">
        {(["day", "week", "foods"] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              closeSheet();
              setTab(t);
            }}
            className="rounded-full border px-3.5 py-1.5 font-mono text-[12px] font-bold capitalize transition-colors"
            style={{
              borderColor: tab === t ? "var(--accent)" : "var(--line)",
              background: tab === t ? "var(--accent)" : "var(--glass-soft)",
              color: tab === t ? "var(--bg)" : "var(--dim)",
            }}
          >
            {t === "foods" ? "My foods" : t}
          </button>
        ))}
      </nav>

      {tab === "day" ? (
        <DayView
          date={date}
          onNav={(n) => {
            closeSheet();
            setDate(addDays(date, n));
          }}
          onGoto={(d) => {
            closeSheet();
            setDate(d);
            setTab("day");
          }}
          training={training}
          onTrainingChange={setTrainingOverride}
          targets={targets}
          totals={totals}
          day={day}
          lastMeal={lastMeal}
          open={open}
          setOpen={(k) => {
            setOpen(k);
            setPick(null);
            setQ("");
            setCustom(false);
          }}
          onRemoveItem={removeItem}
          onRepeat={repeatMeal}
          sheetProps={{ allFoods, pick, setPick, q, setQ, custom, setCustom, onAddPick: addPick, onAddCustom: addCustom, onCancel: closeSheet }}
        />
      ) : tab === "week" ? (
        <WeekView days={days} onGoto={(d) => { setDate(d); setTab("day"); }} />
      ) : (
        <FoodsView myFoods={myFoods} days={days} onDelete={deleteFood} onImport={handleImport} />
      )}
    </div>
  );
}

// ─── Meters ─────────────────────────────────────────────────────────
function Meter({
  label,
  val,
  target,
  range,
  color,
  unit,
}: {
  label: string;
  val: number;
  target: number;
  range?: [number, number];
  color: string;
  unit: string;
}) {
  const max = range ? range[1] : target;
  const pct = Math.min(100, max ? (val / max) * 100 : 0);
  const tickPct = range ? (range[0] / range[1]) * 100 : null;
  const left = range
    ? val >= range[0]
      ? <span style={{ color: "var(--accent)", fontWeight: 600 }}>In range</span>
      : <span>{r0(range[0] - val)} {unit} to go</span>
    : target - val >= 0
      ? <span>{r0(target - val)} {unit} left</span>
      : <span style={{ color: PROT_COLOR }}>{r0(val - target)} {unit} over</span>;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-[13px]">
        <span className="text-muted">{label}</span>
        <span>
          <b className="font-mono text-[16px] font-medium text-ink">{r0(val)}</b>{" "}
          <span className="text-muted">/ {range ? range.join("–") : target.toLocaleString()} {unit}</span>
        </span>
      </div>
      <div className="relative mt-1 h-2.5 overflow-hidden rounded-full" style={{ background: "var(--wash)" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
        {tickPct != null ? (
          <span className="absolute top-[-2px] bottom-[-2px] w-[2px] opacity-40" style={{ left: `${tickPct}%`, background: "var(--ink)" }} />
        ) : null}
      </div>
      <div className="mt-0.5 text-[12.5px] text-muted">{left}</div>
    </div>
  );
}

// ─── Day view ───────────────────────────────────────────────────────
function DayView({
  date,
  onNav,
  onGoto,
  training,
  onTrainingChange,
  targets,
  totals,
  day,
  lastMeal,
  open,
  setOpen,
  onRemoveItem,
  onRepeat,
  sheetProps,
}: {
  date: string;
  onNav: (n: number) => void;
  onGoto: (d: string) => void;
  training: boolean;
  onTrainingChange: (v: boolean) => void;
  targets: { kcal: number; prot: [number, number] };
  totals: { kcal: number; prot: number };
  day: Day;
  lastMeal: (meal: MealKey, before: string) => { date: string; items: DayItem[] } | null;
  open: MealKey | null;
  setOpen: (k: MealKey) => void;
  onRemoveItem: (id: string) => void;
  onRepeat: (meal: MealKey) => void;
  sheetProps: SheetProps;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="sticky top-0 z-[2] -mx-4 flex flex-col gap-2.5 bg-panel px-4 pb-2.5 [backdrop-filter:blur(18px)_saturate(1.3)] md:mx-0 md:px-0">
        <div className="flex items-center justify-between gap-2">
          <button onClick={() => onNav(-1)} aria-label="Previous day" className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-panel text-ink">
            ‹
          </button>
          <h2 className="flex-1 text-center font-sans text-[20px] font-bold tracking-tight text-ink">{fmtDay(date)}</h2>
          <button onClick={() => onNav(1)} aria-label="Next day" className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-panel text-ink">
            ›
          </button>
        </div>
        <div className="flex justify-center gap-1.5">
          <button
            onClick={() => onTrainingChange(true)}
            className="rounded-full border px-3 py-1 font-mono text-[12px]"
            style={training ? { borderColor: "var(--accent)", color: "var(--accent)", background: "var(--wash)", fontWeight: 600 } : { borderColor: "var(--line)", color: "var(--muted)" }}
          >
            Training day
          </button>
          <button
            onClick={() => onTrainingChange(false)}
            className="rounded-full border px-3 py-1 font-mono text-[12px]"
            style={!training ? { borderColor: "var(--accent)", color: "var(--accent)", background: "var(--wash)", fontWeight: 600 } : { borderColor: "var(--line)", color: "var(--muted)" }}
          >
            Rest day
          </button>
        </div>
        <div className={`${CARD} flex flex-col gap-3`}>
          <Meter label="Calories" val={totals.kcal} target={targets.kcal} color="var(--accent)" unit="kcal" />
          <Meter label="Protein" val={totals.prot} target={0} range={targets.prot} color={PROT_COLOR} unit="g" />
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {MEALS.map((m) => {
          const items = (day.items || []).filter((x) => x.meal === m.key);
          const s = sum(items);
          const prev = lastMeal(m.key, date);
          return (
            <section key={m.key} className={CARD}>
              <div className="flex items-baseline justify-between gap-2">
                <div className="font-sans text-[17px] font-bold tracking-tight text-ink">{m.label}</div>
                <div className="font-mono text-[12px] text-muted">
                  {items.length ? (
                    <>
                      {r0(s.kcal)} kcal · <span style={{ color: PROT_COLOR }}>{r0(s.prot)} g</span>
                    </>
                  ) : null}
                </div>
              </div>
              {items.length === 0 ? <div className="mt-1 text-[12.5px] text-muted">Plan: {m.guide}</div> : null}
              <div className="mt-2 flex flex-col">
                {items.map((x) => (
                  <div key={x.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-2.5 border-t border-dashed border-line-soft py-1.5 text-[14px] first:border-t-0">
                    <div className="min-w-0">
                      {x.name}
                      <small className="block text-[12px] text-muted">{x.per === "100g" ? `${x.amt} g` : `× ${x.amt}`}</small>
                    </div>
                    <div className="whitespace-nowrap text-right font-mono text-[13px]">
                      {r0(x.kcal)} kcal
                      <br />
                      <span style={{ color: PROT_COLOR }}>{r1(x.prot)} g</span>
                    </div>
                    <button onClick={() => onRemoveItem(x.id)} aria-label={`Remove ${x.name}`} className="p-1 text-muted hover:text-accent">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              {open === m.key ? (
                <FoodSheet {...sheetProps} />
              ) : (
                <div className="mt-2.5 flex flex-wrap gap-2">
                  <button onClick={() => setOpen(m.key)} className={BTN}>
                    + Add food
                  </button>
                  {prev ? (
                    <button onClick={() => onRepeat(m.key)} className={BTN} title={prev.items.map((x) => x.name).join(", ")}>
                      Same as {fmtDay(prev.date).toLowerCase() === "yesterday" ? "yesterday" : fmtDay(prev.date)}
                    </button>
                  ) : null}
                </div>
              )}
            </section>
          );
        })}
      </div>
      <p className="mt-1 text-[12.5px] text-muted">
        Weigh meat raw and rice/pasta cooked. Built-in values are typical label numbers; for exact ones, save a food
        from your package label in My foods.
      </p>
    </div>
  );
}

// ─── Add-food sheet ─────────────────────────────────────────────────
type SheetProps = {
  allFoods: Food[];
  pick: string | null;
  setPick: (id: string | null) => void;
  q: string;
  setQ: (q: string) => void;
  custom: boolean;
  setCustom: (v: boolean) => void;
  onAddPick: (amt: string) => boolean;
  onAddCustom: (input: { name: string; amt: string; per: PerMode; kcal: number; prot: number; keep: boolean }) => boolean;
  onCancel: () => void;
};

function FoodSheet(props: SheetProps) {
  const { allFoods, pick, setPick, q, setQ, custom, setCustom, onAddPick, onAddCustom, onCancel } = props;
  const [amt, setAmt] = useState("");
  const [status, setStatus] = useState("");
  const [cName, setCName] = useState(q);
  const [cAmt, setCAmt] = useState("");
  const [cPer, setCPer] = useState<PerMode>("100g");
  const [cKcal, setCKcal] = useState("");
  const [cProt, setCProt] = useState("");
  const [cSave, setCSave] = useState(true);

  const f = pick ? allFoods.find((x) => x.id === pick) : null;
  useEffect(() => {
    setAmt(f?.per === "unit" ? "1" : "");
  }, [pick]); // eslint-disable-line react-hooks/exhaustive-deps

  if (custom) {
    return (
      <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
        <Field label="Food name">
          <input value={cName} onChange={(e) => setCName(e.target.value)} placeholder="e.g. Costco protein bar" className="sheet-input" />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Amount">
            <input inputMode="decimal" value={cAmt} onChange={(e) => setCAmt(e.target.value)} placeholder="100" className="sheet-input" />
          </Field>
          <Field label="Measured as">
            <select value={cPer} onChange={(e) => setCPer(e.target.value as PerMode)} className="sheet-input">
              <option value="100g">grams</option>
              <option value="unit">servings / pieces</option>
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Field label={`kcal ${cPer === "100g" ? "per 100 g" : "per serving"}`}>
            <input inputMode="decimal" value={cKcal} onChange={(e) => setCKcal(e.target.value)} placeholder="0" className="sheet-input" />
          </Field>
          <Field label={`Protein (g) ${cPer === "100g" ? "per 100 g" : "per serving"}`}>
            <input inputMode="decimal" value={cProt} onChange={(e) => setCProt(e.target.value)} placeholder="0" className="sheet-input" />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-[13px] text-muted">
          <input type="checkbox" checked={cSave} onChange={(e) => setCSave(e.target.checked)} /> Save to My foods
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (!cName.trim()) return setStatus("Give the food a name.");
              if (!(parseFloat(cAmt) > 0)) return setStatus("Enter an amount.");
              onAddCustom({ name: cName.trim(), amt: cAmt, per: cPer, kcal: parseFloat(cKcal) || 0, prot: parseFloat(cProt) || 0, keep: cSave });
            }}
            className={BTN_SOLID}
          >
            Add
          </button>
          <button onClick={onCancel} className={BTN}>
            Cancel
          </button>
        </div>
        {status ? <span className="text-[12.5px] text-muted">{status}</span> : null}
        <style jsx>{`.sheet-input{width:100%;border-radius:8px;border:1px solid var(--line);background:var(--bg);color:var(--ink);padding:8px 10px;font:inherit;font-size:13px}`}</style>
      </div>
    );
  }

  const query = q.trim().toLowerCase();
  const list = allFoods.filter((x) => !query || x.name.toLowerCase().includes(query)).slice(0, 40);
  const preview = f && parseFloat(amt) > 0 ? calc(f, amt) : null;

  return (
    <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
      <input
        autoFocus
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setPick(null);
        }}
        placeholder="Search foods (chicken, rice, eggs…)"
        className="w-full rounded-[8px] border border-line bg-bg px-2.5 py-2 text-[13px] text-ink outline-none focus:border-line-hot"
      />
      <div className="flex max-h-[220px] flex-col overflow-y-auto rounded-[8px] border border-line">
        {list.length === 0 ? (
          <div className="p-2.5 text-[13px] text-muted">No match. Add it as a custom food.</div>
        ) : (
          list.map((x, i) => (
            <button
              key={x.id}
              onClick={() => setPick(x.id)}
              className="flex items-center justify-between gap-2 border-t border-line px-2.5 py-2 text-left text-[13px] first:border-t-0"
              style={{ background: x.id === pick ? "var(--wash)" : undefined }}
            >
              <span>
                {x.name}
                {x.mine ? " ★" : ""}
              </span>
              <small className="shrink-0 font-mono text-[11.5px] text-muted">
                {r0(x.kcal)} kcal · {r1(x.prot)} g / {x.per === "100g" ? "100 g" : "each"}
              </small>
            </button>
          ))
        )}
      </div>
      {f ? (
        <div className="grid grid-cols-2 gap-2">
          <Field label={f.per === "100g" ? "Grams" : "How many"}>
            <input
              autoFocus
              inputMode="decimal"
              value={amt}
              onChange={(e) => setAmt(e.target.value)}
              placeholder={f.per === "100g" ? "200" : "1"}
              className="w-full rounded-[8px] border border-line bg-bg px-2.5 py-2 text-[13px] text-ink"
            />
          </Field>
          <Field label="Adds">
            <div className="font-mono text-[13px] text-ink">
              {preview ? (
                <>
                  {r0(preview.kcal)} kcal · <span style={{ color: PROT_COLOR }}>{r1(preview.prot)} g</span>
                </>
              ) : (
                "–"
              )}
            </div>
          </Field>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {f ? (
          <button
            onClick={() => {
              if (!(parseFloat(amt) > 0)) return setStatus("Enter an amount.");
              onAddPick(amt);
            }}
            className={BTN_SOLID}
          >
            Add {f.name.split(" (")[0]}
          </button>
        ) : null}
        <button onClick={() => setCustom(true)} className={BTN}>
          Custom food
        </button>
        <button onClick={onCancel} className={BTN}>
          Cancel
        </button>
      </div>
      {status ? <span className="text-[12.5px] text-muted">{status}</span> : null}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-[12px] text-muted">
      {label}
      {children}
    </label>
  );
}

// ─── Week view ──────────────────────────────────────────────────────
function WeekView({ days, onGoto }: { days: Record<string, Day>; onGoto: (d: string) => void }) {
  const t = iso(new Date());
  const rows = useMemo(() => {
    const out: { d: string; s: { kcal: number; prot: number }; tr: boolean; tg: { kcal: number }; logged: boolean }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = addDays(t, -i);
      const day = days[d] || { date: d, items: [] };
      const s = sum(day.items || []);
      const tr = typeof day.training === "boolean" ? day.training : TRAIN_DAYS.includes(parseISO(d).getDay());
      const tg = tr ? TARGET.training : TARGET.rest;
      out.push({ d, s, tr, tg, logged: (day.items || []).length > 0 });
    }
    return out;
  }, [days, t]);
  const logged = rows.filter((r) => r.logged);
  const avg = logged.length
    ? { kcal: logged.reduce((a, r) => a + r.s.kcal, 0) / logged.length, prot: logged.reduce((a, r) => a + r.s.prot, 0) / logged.length }
    : null;

  return (
    <div className="flex flex-col gap-3">
      <div className={CARD}>
        <h3 className="mb-2 font-mono text-[11px] tracking-[0.16em] uppercase text-muted">Last 7 days</h3>
        {avg ? (
          <p className="mb-2.5 text-[13.5px] text-dim">
            Average on {logged.length} logged day{logged.length > 1 ? "s" : ""}:{" "}
            <b className="font-mono text-ink">{r0(avg.kcal).toLocaleString()} kcal</b> ·{" "}
            <b className="font-mono" style={{ color: PROT_COLOR }}>{r0(avg.prot)} g protein</b>
          </p>
        ) : (
          <p className="mb-2.5 text-[13px] text-muted">Nothing logged this week yet. Log a few days and your averages show here.</p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-mono text-[13px]">
            <thead>
              <tr className="text-left">
                {["Day", "Type", "kcal", "Protein", ""].map((h) => (
                  <th key={h} className="border-b border-line py-1.5 pr-2 text-[11px] font-semibold tracking-wide text-muted uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.d} onClick={() => onGoto(r.d)} className="cursor-pointer">
                  <td className="border-b border-line py-1.5 pr-2">{fmtDay(r.d)}</td>
                  <td className="border-b border-line py-1.5 pr-2 text-muted">{r.tr ? "Training" : "Rest"}</td>
                  <td className="border-b border-line py-1.5 pr-2">{r.logged ? r0(r.s.kcal).toLocaleString() : "–"}</td>
                  <td className="border-b border-line py-1.5 pr-2" style={{ color: PROT_COLOR }}>
                    {r.logged ? `${r0(r.s.prot)} g` : "–"}
                  </td>
                  <td className="border-b border-line py-1.5">
                    <div className="h-1.5 min-w-[50px] overflow-hidden rounded-full" style={{ background: "var(--wash)" }}>
                      <div className="h-full" style={{ width: `${r.logged ? Math.min(100, (r.s.kcal / r.tg.kcal) * 100) : 0}%`, background: "var(--accent)" }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={CARD}>
        <h3 className="mb-2 font-mono text-[11px] tracking-[0.16em] uppercase text-muted">Targets</h3>
        <table className="w-full border-collapse text-[13.5px]">
          <tbody>
            <tr>
              <td className="border-b border-line py-1.5 text-dim">Calories</td>
              <td className="border-b border-line py-1.5 font-mono">~2,700</td>
              <td className="border-b border-line py-1.5 font-mono">~2,550</td>
            </tr>
            <tr>
              <td className="py-1.5 text-dim">Protein</td>
              <td className="py-1.5 font-mono">140–160 g</td>
              <td className="py-1.5 font-mono">140–160 g</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2 text-[12.5px] text-muted">
          Every 4 weeks, check your weight trend in the Lift Log. Under 0.25 kg/month: add 50 g cooked rice to lunch
          and dinner. Over 0.5 kg/month with a growing waist: remove 50 g rice from dinner.
        </p>
      </div>
    </div>
  );
}

// ─── My foods view ──────────────────────────────────────────────────
function FoodsView({
  myFoods,
  days,
  onDelete,
  onImport,
}: {
  myFoods: Food[];
  days: Record<string, Day>;
  onDelete: (id: string) => void;
  onImport: (data: unknown) => void;
}) {
  const sorted = [...myFoods].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="flex flex-col gap-3">
      <div className={CARD}>
        <h3 className="mb-2 font-mono text-[11px] tracking-[0.16em] uppercase text-muted">My foods</h3>
        <p className="mb-2.5 text-[13px] text-dim">
          Foods you save from a custom entry show here and at the top of search, marked ★. Use the numbers from the
          package label.
        </p>
        {sorted.length === 0 ? (
          <p className="text-[13.5px] text-dim">
            No saved foods yet. On the Day tab, tap + Add food, then Custom food, and keep &quot;Save to My foods&quot; ticked.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[14px]">
              <thead>
                <tr className="text-left">
                  {["Food", "kcal", "Protein", "Per", ""].map((h) => (
                    <th key={h} className="border-b border-line py-1.5 pr-2 text-[11px] font-semibold tracking-wide text-muted uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((f) => (
                  <FoodRow key={f.id} f={f} onDelete={onDelete} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className={`${CARD} flex flex-col gap-2`}>
        <h3 className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted">Backup</h3>
        <ExportImport filename="meal-log" getData={() => ({ days, myFoods })} onImport={onImport} />
      </div>
    </div>
  );
}

function FoodRow({ f, onDelete }: { f: Food; onDelete: (id: string) => void }) {
  const [armed, setArmed] = useState(false);
  return (
    <tr>
      <td className="border-b border-line py-1.5 pr-2">{f.name}</td>
      <td className="border-b border-line py-1.5 pr-2 font-mono">{r0(f.kcal)}</td>
      <td className="border-b border-line py-1.5 pr-2 font-mono">{r1(f.prot)} g</td>
      <td className="border-b border-line py-1.5 pr-2 text-muted">{f.per === "100g" ? "100 g" : "each"}</td>
      <td className="border-b border-line py-1.5">
        <button onClick={() => (armed ? onDelete(f.id) : setArmed(true))} className="text-muted hover:text-accent" aria-label={`Delete ${f.name}`}>
          {armed ? "sure?" : "✕"}
        </button>
      </td>
    </tr>
  );
}
