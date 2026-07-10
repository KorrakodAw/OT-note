"use client";

import { useEffect, useMemo, useState } from "react";
import { OtEntry } from "@/lib/types";
import { loadEntries, loadHourlyRate, saveHourlyRate } from "@/lib/otStorage";
import { defaultPeriod, isWithinPeriod } from "@/lib/period";

export default function SalaryPage() {
  const [entries, setEntries] = useState<OtEntry[]>([]);
  const [rate, setRate] = useState(0);
  const [rateInput, setRateInput] = useState("0");
  const [{ start, end }, setPeriod] = useState(() => defaultPeriod());

  useEffect(() => {
    setEntries(loadEntries());
    const savedRate = loadHourlyRate();
    setRate(savedRate);
    setRateInput(String(savedRate));
  }, []);

  const entriesInPeriod = useMemo(
    () => entries.filter((e) => isWithinPeriod(e.date, start, end)).sort((a, b) => a.date.localeCompare(b.date)),
    [entries, start, end]
  );

  const totalHours = useMemo(
    () => entriesInPeriod.reduce((sum, e) => sum + e.hours, 0),
    [entriesInPeriod]
  );

  const totalPay = totalHours * rate;

  function handleRateChange(value: string) {
    setRateInput(value);
    const parsed = Number(value);
    const nextRate = Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
    setRate(nextRate);
    saveHourlyRate(nextRate);
  }

  function resetToDefaultPeriod() {
    setPeriod(defaultPeriod());
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-base font-semibold text-slate-800">Pay period</h2>
        <p className="mb-3 text-xs text-slate-500">
          Defaults to the 21st of one month through the 20th of the next. Adjust if needed.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-600">Start date</span>
            <input
              type="date"
              value={start}
              onChange={(e) => setPeriod((p) => ({ ...p, start: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-600">End date</span>
            <input
              type="date"
              value={end}
              onChange={(e) => setPeriod((p) => ({ ...p, end: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </label>
        </div>
        <button
          onClick={resetToDefaultPeriod}
          className="mt-3 text-xs font-medium text-brand-600 hover:underline"
        >
          Reset to default period
        </button>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-base font-semibold text-slate-800">OT hourly rate</h2>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-600">Rate per hour (THB)</span>
          <input
            type="number"
            min={0}
            step={1}
            value={rateInput}
            onChange={(e) => handleRateChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </label>
      </div>

      <div className="rounded-xl bg-brand-500 p-4 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-brand-100">Total OT hours</p>
            <p className="text-2xl font-semibold">{totalHours}h</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-brand-100">Total OT pay</p>
            <p className="text-2xl font-semibold">
              {totalPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} THB
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-base font-semibold text-slate-800">
          Entries in period ({start} → {end})
        </h2>
        {entriesInPeriod.length === 0 ? (
          <p className="text-sm text-slate-500">No OT entries in this period yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {entriesInPeriod.map((entry) => (
              <li key={entry.date} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <p className="font-medium text-slate-700">
                    {entry.date} <span className="font-normal text-slate-400">· {entry.startTime}</span>
                  </p>
                  <p className="text-xs text-slate-500">{entry.reason}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">{entry.hours}h</p>
                  <p className="text-xs text-slate-500">
                    {(entry.hours * rate).toLocaleString(undefined, { maximumFractionDigits: 2 })} THB
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
