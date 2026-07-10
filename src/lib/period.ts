// OT pay period runs the 21st of one month through the 21st of the next month.
export function toDateKey(year: number, monthIndex0: number, day: number): string {
  const mm = String(monthIndex0 + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

export function defaultPeriod(reference: Date = new Date()): { start: string; end: string } {
  const year = reference.getFullYear();
  const month = reference.getMonth(); // 0-based
  const day = reference.getDate();

  // The period containing `reference`: if we're on/after the 21st, the period
  // started this month; otherwise it started the previous month.
  const startMonthDate = day >= 21 ? new Date(year, month, 1) : new Date(year, month - 1, 1);
  const startYear = startMonthDate.getFullYear();
  const startMonth = startMonthDate.getMonth();
  const endMonthDate = new Date(startYear, startMonth + 1, 1);

  return {
    start: toDateKey(startYear, startMonth, 21),
    end: toDateKey(endMonthDate.getFullYear(), endMonthDate.getMonth(), 21),
  };
}

export function isWithinPeriod(dateKey: string, start: string, end: string): boolean {
  return dateKey >= start && dateKey <= end;
}
