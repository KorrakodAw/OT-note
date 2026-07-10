"use client";

import { useEffect, useState } from "react";
import { OtEntry } from "@/lib/types";

interface OtModalProps {
  date: string; // YYYY-MM-DD
  existing: OtEntry | null;
  onClose: () => void;
  onSave: (entry: OtEntry) => void;
  onDelete: (date: string) => void;
}

const DEFAULT_START_TIME = "17:30";

export default function OtModal({ date, existing, onClose, onSave, onDelete }: OtModalProps) {
  const [startTime, setStartTime] = useState(existing?.startTime ?? DEFAULT_START_TIME);
  const [hours, setHours] = useState(existing ? String(existing.hours) : "");
  const [reason, setReason] = useState(existing?.reason ?? "");
  const [error, setError] = useState("");

  useEffect(() => {
    setStartTime(existing?.startTime ?? DEFAULT_START_TIME);
    setHours(existing ? String(existing.hours) : "");
    setReason(existing?.reason ?? "");
    setError("");
  }, [date, existing]);

  function handleSave() {
    if (!startTime) {
      setError("Enter a start time.");
      return;
    }
    const parsedHours = Number(hours);
    if (!hours || Number.isNaN(parsedHours) || parsedHours <= 0) {
      setError("Enter a valid number of hours greater than 0.");
      return;
    }
    if (parsedHours > 24) {
      setError("Hours can't exceed 24 for a single day.");
      return;
    }
    if (!reason.trim()) {
      setError("Enter a reason for the OT.");
      return;
    }
    onSave({ date, startTime, hours: parsedHours, reason: reason.trim() });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">OT for {date}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <label className="mb-3 block text-sm">
          <span className="mb-1 block font-medium text-slate-600">Start time</span>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </label>

        <label className="mb-3 block text-sm">
          <span className="mb-1 block font-medium text-slate-600">Hours</span>
          <input
            type="number"
            min={0.5}
            max={24}
            step={0.5}
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            placeholder="e.g. 2.5"
          />
        </label>

        <label className="mb-3 block text-sm">
          <span className="mb-1 block font-medium text-slate-600">Reason</span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            placeholder="e.g. Month-end closing"
          />
        </label>

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        <div className="flex items-center justify-between gap-2">
          {existing ? (
            <button
              onClick={() => onDelete(date)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
