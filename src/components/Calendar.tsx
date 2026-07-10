"use client";

import { OtEntry } from "@/lib/types";
import { toDateKey } from "@/lib/period";

interface CalendarProps {
  dates: Date[]; // 21st of the cycle month through the 20th of the next, inclusive
  entriesByDate: Record<string, OtEntry>;
  todayKey: string;
  onSelectDay: (dateKey: string) => void;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function Calendar({ dates, entriesByDate, todayKey, onSelectDay }: CalendarProps) {
  const leadingBlanks = dates.length > 0 ? dates[0].getDay() : 0;
  const totalCells = Math.ceil((leadingBlanks + dates.length) / 7) * 7;

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dateIndex = i - leadingBlanks;
    if (dateIndex < 0 || dateIndex >= dates.length) return null;
    return dates[dateIndex];
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
        {cells.map((date, idx) => {
          if (date === null) {
            return <div key={idx} className="aspect-square rounded-lg" />;
          }
          const dateKey = toDateKey(date.getFullYear(), date.getMonth(), date.getDate());
          const entry = entriesByDate[dateKey];
          const isToday = dateKey === todayKey;
          const isWeekend = idx % 7 === 0 || idx % 7 === 6;
          const isMonthStart = date.getDate() === 1;

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
              {isMonthStart && (
                <span className="text-[9px] font-semibold uppercase text-slate-400">
                  {MONTH_SHORT[date.getMonth()]}
                </span>
              )}
              <span
                className={`font-medium ${
                  entry ? "text-green-700" : isWeekend ? "text-red-500" : "text-slate-700"
                }`}
              >
                {date.getDate()}
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
