"use client";

import { OtEntry } from "@/lib/types";
import { toDateKey } from "@/lib/period";

interface CalendarProps {
  year: number;
  month: number; // 0-based
  entriesByDate: Record<string, OtEntry>;
  todayKey: string;
  onSelectDay: (dateKey: string) => void;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar({ year, month, entriesByDate, todayKey, onSelectDay }: CalendarProps) {
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = firstOfMonth.getDay();
  const totalCells = Math.ceil((leadingBlanks + daysInMonth) / 7) * 7;

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dayNumber = i - leadingBlanks + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) return null;
    return dayNumber;
  });

  return (
    <div>
      <div className="mb-1 grid grid-cols-7 gap-1 text-center text-xs font-medium">
        {WEEKDAY_LABELS.map((d, idx) => (
          <div key={d} className={`py-1 ${idx === 0 || idx === 6 ? "text-red-500" : "text-slate-500"}`}>
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={idx} className="aspect-square rounded-lg" />;
          }
          const dateKey = toDateKey(year, month, day);
          const entry = entriesByDate[dateKey];
          const isToday = dateKey === todayKey;
          const isWeekend = idx % 7 === 0 || idx % 7 === 6;

          return (
            <button
              key={idx}
              onClick={() => onSelectDay(dateKey)}
              title={entry ? `Start ${entry.startTime} · ${entry.hours}h · ${entry.reason}` : undefined}
              className={`flex aspect-square flex-col items-center justify-center overflow-hidden rounded-lg border p-1 text-sm transition-colors ${
                entry
                  ? "border-green-300 bg-green-50 hover:bg-green-100"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              } ${isToday ? "ring-2 ring-brand-500" : ""}`}
            >
              <span
                className={`font-medium ${
                  entry ? "text-green-700" : isWeekend ? "text-red-500" : "text-slate-700"
                }`}
              >
                {day}
              </span>
              {entry && (
                <span className="mt-0.5 flex max-w-full flex-col items-center gap-0.5 rounded bg-green-500 px-1 text-[10px] font-semibold text-white">
                  <span className="max-w-full truncate">{entry.reason}</span>
                  <span>{entry.hours}h</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
