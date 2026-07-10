import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "OT Note",
  description: "Track daily overtime and calculate OT salary",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col">
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
              <h1 className="text-lg font-semibold text-slate-800">OT Note</h1>
              <nav className="flex gap-4 text-sm font-medium">
                <Link href="/" className="text-slate-600 hover:text-brand-600">
                  Calendar
                </Link>
                <Link href="/salary" className="text-slate-600 hover:text-brand-600">
                  Salary
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1 px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
