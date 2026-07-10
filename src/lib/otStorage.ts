import { OtEntry } from "./types";

const ENTRIES_KEY = "ot-note:entries";
const RATE_KEY = "ot-note:hourly-rate";

export function loadEntries(): OtEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ENTRIES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveEntries(entries: OtEntry[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export function upsertEntry(entry: OtEntry): OtEntry[] {
  const entries = loadEntries().filter((e) => e.date !== entry.date);
  entries.push(entry);
  entries.sort((a, b) => a.date.localeCompare(b.date));
  saveEntries(entries);
  return entries;
}

export function deleteEntry(date: string): OtEntry[] {
  const entries = loadEntries().filter((e) => e.date !== date);
  saveEntries(entries);
  return entries;
}

export function loadHourlyRate(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(RATE_KEY);
  const value = raw ? Number(raw) : 0;
  return Number.isFinite(value) ? value : 0;
}

export function saveHourlyRate(rate: number): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RATE_KEY, String(rate));
}
