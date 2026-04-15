"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const MONTHS = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

interface Entry {
  id: string;
  content: string;
  created_at: number;
}

export default function SavedPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const router = useRouter();

  useEffect(() => {
    fetch("/api/entries")
      .then((res) => res.json())
      .then((data) => setEntries(data))
      .catch(console.error);
  }, []);

  // Map of "YYYY-MM-DD" string to entry id
  const entryMap = new Map<string, string>();
  entries.forEach((e) => {
    const d = new Date(e.created_at);
    const mStr = String(d.getMonth() + 1).padStart(2, '0');
    const dStr = String(d.getDate()).padStart(2, '0');
    const dateStr = `${d.getFullYear()}-${mStr}-${dStr}`;
    if (!entryMap.has(dateStr)) {
      entryMap.set(dateStr, e.id);
    }
  });

  return (
    <div className="flex flex-col gap-8 pb-12 w-full max-w-6xl mx-auto mt-4">
      {/* Header section similar to the output lines in terminal */}
      <div>
        <div className="output-line">
          <span className="cmd">~</span>{" "}
          <span className="comment"># Saved Journal Entries</span>
        </div>
        <div className="output-line">
          <span className="cmd">~</span>{" "}
          <span className="comment"># Showing overview for year {year}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-end border-b border-[var(--t-border)] pb-2 mb-4">
        <div className="flex gap-4 mb-1">
          <button 
            className="text-[var(--t-dim)] hover:text-[var(--az-light)] hover:bg-[rgba(145,186,214,0.1)] px-3 py-1 rounded transition-colors border border-[var(--t-border)]"
            onClick={() => setYear(y => y - 1)}
          >
            ← Prev Year
          </button>
          <button 
            className="text-[var(--t-dim)] hover:text-[var(--az-light)] hover:bg-[rgba(145,186,214,0.1)] px-3 py-1 rounded transition-colors border border-[var(--t-border)]"
            onClick={() => setYear(y => y + 1)}
          >
            Next Year →
          </button>
        </div>
        <h1 className="text-3xl font-bold tracking-widest" style={{ color: "var(--az-light)" }}>
          {year}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-12">
        {MONTHS.map((month, index) => (
          <MonthCalendar
            key={month}
            year={year}
            month={index}
            monthName={month}
            entryMap={entryMap}
            router={router}
          />
        ))}
      </div>
    </div>
  );
}

function MonthCalendar({
  year,
  month,
  monthName,
  entryMap,
  router,
}: {
  year: number;
  month: number;
  monthName: string;
  entryMap: Map<string, string>;
  router: any;
}) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="flex flex-col">
      <div className="text-center font-bold tracking-widest mb-1" style={{ color: "var(--az-light)" }}>
        {monthName}
      </div>
      <div className="grid grid-cols-7 text-center text-xs py-1 mb-2" style={{ backgroundColor: "var(--az-darkest)", borderTop: "1px solid var(--t-border)", borderBottom: "1px solid var(--t-border)" }}>
        {DAYS.map((d, i) => (
          <div key={i} className="font-semibold" style={{ color: "var(--az-lightest)" }}>
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center text-xs gap-y-1">
        {blanks.map((b) => (
          <div key={`blank-${b}`} className="w-7 h-7" />
        ))}
        {days.map((d) => {
          const mStr = String(month + 1).padStart(2, '0');
          const dStr = String(d).padStart(2, '0');
          const dateStr = `${year}-${mStr}-${dStr}`;
          const entryId = entryMap.get(dateStr);
          
          if (entryId) {
             return (
               <div
                 key={d}
                 className="flex justify-center items-center w-7 h-7 mx-auto rounded-[3px] font-bold cursor-pointer transition-all"
                 style={{
                   backgroundColor: "var(--az-accent)",
                   color: "var(--az-lightest)",
                   boxShadow: "0 0 8px var(--t-glow)",
                 }}
                 title="Journal entry saved"
                 onClick={() => {
                   router.push(`/?id=${entryId}`);
                 }}
               >
                 {d}
               </div>
             );
          } else {
             return (
               <div
                 key={d}
                 className="flex justify-center items-center w-7 h-7 mx-auto rounded-[3px] transition-colors cursor-pointer"
                 style={{ color: "var(--t-dim)" }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.color = "var(--az-lightest)";
                   e.currentTarget.style.backgroundColor = "rgba(145, 186, 214, 0.1)";
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.color = "var(--t-dim)";
                   e.currentTarget.style.backgroundColor = "transparent";
                 }}
                 onClick={() => {
                   router.push(`/?date=${dateStr}`);
                 }}
               >
                 {d}
               </div>
             );
          }
        })}
      </div>
    </div>
  );
}
