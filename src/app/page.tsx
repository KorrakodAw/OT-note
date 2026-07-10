"use client";

import { useEffect, useMemo, useState } from "react";
import Calendar from "@/components/Calendar";
import OtModal from "@/components/OtModal";
import { OtEntry } from "@/lib/types";
import { deleteEntry, loadEntries, upsertEntry } from "@/lib/otStorage";
import { toDateKey } from "@/lib/period";

const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function HomePage() {
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
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

  const monthTotalHours = useMemo(
    () =>
      entries
        .filter((e) => e.date.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`))
        .reduce((sum, e) => sum + e.hours, 0),
    [entries, year, month]
  );

  function goToMonth(delta: number) {
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
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

  return (
    <div>
      <div className="mb-4 flex items-center justify-between rounded-xl bg-white p-3 shadow-sm">
        <button
          onClick={() => goToMonth(-1)}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          ← Prev
        </button>
        <div className="text-center">
          <p className="text-base font-semibold text-slate-800">
            {MONTH_LABELS[month]} {year}
          </p>
          <p className="text-xs text-slate-500">{monthTotalHours}h OT logged this month</p>
        </div>
        <button
          onClick={() => goToMonth(1)}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Next →
        </button>
      </div>

      <div className="rounded-xl bg-white p-3 shadow-sm">
        <Calendar
          year={year}
          month={month}
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
