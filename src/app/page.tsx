"use client";

import { useEffect, useMemo, useState } from "react";
import Calendar from "@/components/Calendar";
import OtModal from "@/components/OtModal";
import { OtEntry } from "@/lib/types";
import { deleteEntry, loadEntries, upsertEntry } from "@/lib/otStorage";
import { defaultPeriodCycle, isWithinPeriod, periodDates, periodRange, toDateKey } from "@/lib/period";

const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function HomePage() {
  const today = useMemo(() => new Date(), []);
  const initialCycle = useMemo(() => defaultPeriodCycle(today), [today]);
  const [cycleYear, setCycleYear] = useState(initialCycle.year);
  const [cycleMonth, setCycleMonth] = useState(initialCycle.month);
  const [entries, setEntries] = useState<OtEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    setEntries(loadEntries());
  }, []);

  const entriesByDate = useMemo(() => {
    const map: Record<string, OtEntry> = {};
    for (const entry of entries) map[entry.date] = entry;
    return map;
  }, [entries]);

  const dates = useMemo(() => periodDates(cycleYear, cycleMonth), [cycleYear, cycleMonth]);
  const { start, end } = useMemo(() => periodRange(cycleYear, cycleMonth), [cycleYear, cycleMonth]);

  const periodTotalHours = useMemo(
    () =>
      entries
        .filter((e) => isWithinPeriod(e.date, start, end))
        .reduce((sum, e) => sum + e.hours, 0),
    [entries, start, end]
  );

  function goToCycle(delta: number) {
    const next = new Date(cycleYear, cycleMonth + delta, 1);
    setCycleYear(next.getFullYear());
    setCycleMonth(next.getMonth());
  }

  function handleSave(entry: OtEntry) {
    setEntries(upsertEntry(entry));
    setSelectedDate(null);
  }

  function handleDelete(date: string) {
    setEntries(deleteEntry(date));
    setSelectedDate(null);
  }

  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const endMonthDate = new Date(cycleYear, cycleMonth + 1, 1);
  const periodLabel = `21 ${MONTH_SHORT[cycleMonth]} – 20 ${MONTH_SHORT[endMonthDate.getMonth()]} ${endMonthDate.getFullYear()}`;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between rounded-xl bg-white p-3 shadow-sm">
        <button
          onClick={() => goToCycle(-1)}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          ← Prev
        </button>
        <div className="text-center">
          <p className="text-base font-semibold text-slate-800">{periodLabel}</p>
          <p className="text-xs text-slate-500">{periodTotalHours}h OT logged this period</p>
        </div>
        <button
          onClick={() => goToCycle(1)}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Next →
        </button>
      </div>

      <div className="rounded-xl bg-white p-3 shadow-sm">
        <Calendar
          dates={dates}
          entriesByDate={entriesByDate}
          todayKey={todayKey}
          onSelectDay={setSelectedDate}
        />
      </div>

      <p className="mt-3 text-center text-xs text-slate-400">
        Tap a day to add, edit, or remove its OT entry. Each day allows only one OT record.
      </p>

      {selectedDate && (
        <OtModal
          date={selectedDate}
          existing={entriesByDate[selectedDate] ?? null}
          onClose={() => setSelectedDate(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
