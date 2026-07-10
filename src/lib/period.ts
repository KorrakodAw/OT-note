// OT pay period runs the 21st of one month through the 20th of the next month.
export function toDateKey(year: number, monthIndex0: number, day: number): string {
  const mm = String(monthIndex0 + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

// The cycle is identified by the year/month of its 21st (start) day.
export function defaultPeriodCycle(reference: Date = new Date()): { year: number; month: number } {
  const year = reference.getFullYear();
  const month = reference.getMonth(); // 0-based
  const day = reference.getDate();

  // If we're on/after the 21st, the cycle started this month; otherwise it
  // started the previous month.
  const startMonthDate = day >= 21 ? new Date(year, month, 1) : new Date(year, month - 1, 1);
  return { year: startMonthDate.getFullYear(), month: startMonthDate.getMonth() };
}

export function periodRange(cycleYear: number, cycleMonth: number): { start: string; end: string } {
  const endMonthDate = new Date(cycleYear, cycleMonth + 1, 1);
  return {
    start: toDateKey(cycleYear, cycleMonth, 21),
    end: toDateKey(endMonthDate.getFullYear(), endMonthDate.getMonth(), 20),
  };
}

export function defaultPeriod(reference: Date = new Date()): { start: string; end: string } {
  const { year, month } = defaultPeriodCycle(reference);
  return periodRange(year, month);
}

// All calendar dates from the 21st of `cycleYear`/`cycleMonth` through the
// 20th of the following month, inclusive.
export function periodDates(cycleYear: number, cycleMonth: number): Date[] {
  const start = new Date(cycleYear, cycleMonth, 21);
  const end = new Date(cycleYear, cycleMonth + 1, 20);
  const dates: Date[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

export function isWithinPeriod(dateKey: string, start: string, end: string): boolean {
  return dateKey >= start && dateKey <= end;
}
