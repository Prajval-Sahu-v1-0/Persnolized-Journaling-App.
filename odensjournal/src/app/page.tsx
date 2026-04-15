"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

const PALETTE = [
  "#1E3F66",
  "#2E5984",
  "#528AAE",
  "#73A5C6",
  "#91BAD6",
  "#BCD2E8",
];

interface Entry {
  id: string;
  content: string;
  created_at: number;
}

function JournalEditor() {
  const [entry, setEntry] = useState("");
  const [existingContent, setExistingContent] = useState("");
  const [saving, setSaving] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const idStr = searchParams.get("id");
  const dateParam = searchParams.get("date");
  const [entryId, setEntryId] = useState<string | null>(null);
  const [targetDateStr, setTargetDateStr] = useState<string | null>(null);

  const [allEntries, setAllEntries] = useState<Entry[]>([]);

  const fetchAllEntries = useCallback(() => {
    fetch("/api/entries")
      .then(res => res.json())
      .then(data => setAllEntries(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchAllEntries();
  }, [fetchAllEntries]);

  useEffect(() => {
    if (idStr) {
      setEntryId(idStr);
      setTargetDateStr(null);
      fetch(`/api/entries/${idStr}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.content) {
            setExistingContent(data.content);
            setEntry("");
          }
        })
        .catch(console.error);
    } else {
      setEntryId(null);
      setEntry("");
      setExistingContent("");
      if (dateParam) {
        setTargetDateStr(dateParam);
      } else {
        setTargetDateStr(null);
      }
    }
  }, [idStr, dateParam]);

  const saveEntry = useCallback(async () => {
    if (!entry.trim() || saving) return;
    setSaving(true);
    try {
      const fullContent = existingContent ? existingContent + "\n\n" + entry.trim() : entry.trim();

      if (entryId) {
        await fetch(`/api/entries/${entryId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: fullContent }),
        });
        setExistingContent(fullContent);
        setEntry("");
      } else {
        const payload: any = { content: fullContent };
        if (targetDateStr) {
            // we use the local timezone to match the clicked calendar day correctly
            payload.createdAt = new Date(targetDateStr + "T12:00:00").valueOf();
        }
        
        const res = await fetch("/api/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data && data.id) {
          setEntryId(data.id);
          setExistingContent(fullContent);
          setEntry("");
          router.replace(`/?id=${data.id}`);
        }
      }
      fetchAllEntries();
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  }, [entry, existingContent, saving, entryId, targetDateStr, router, fetchAllEntries]);

  const today = new Date();
  const displayDateStr = targetDateStr 
    ? new Date(targetDateStr + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + i);
    return d;
  });

  return (
    <>
      {/* ── Top Section: Neofetch + Quick Access ────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start w-full gap-6">
        {/* ── Neofetch ────────────────────────────── */}
        <div className="neofetch" style={{ marginBottom: 0 }}>
          <Image
            src="/cozy-logo.jpg"
            alt="Oden's Journal"
            width={170}
            height={170}
            className="logo-image"
            priority
          />
          <div className="sys-info">
            <div className="title-line">
              oden<span style={{ color: "var(--t-dim)" }}>@</span>journal
            </div>
            <div className="separator">─────────────────</div>
            <InfoRow label="OS: " value="OdenJournal v0.1.0" />
            <InfoRow label="Date: " value={displayDateStr} />
            <InfoRow label="Uptime: " value="always on" />
            <InfoRow label="Shell: " value="oden-sh 1.0" />
            <InfoRow label="DB: " value="SQLite 3.45 (journal.db)" />
            <InfoRow label="Entries: " value={allEntries.length.toString()} />
            <InfoRow label="Theme: " value="Gentle Azul" />
            <InfoRow label="Font: " value="Geist Mono" />

            <div className="color-blocks">
              {PALETTE.map((c) => (
                <div
                  key={c}
                  className="color-block"
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Quick Access Week Bar ─────────────────── */}
        <div className="flex gap-2 shrink-0 flex-wrap justify-end">
          {weekDays.map(d => {
            const mStr = String(d.getMonth() + 1).padStart(2, '0');
            const dStr = String(d.getDate()).padStart(2, '0');
            const dateStrMatch = `${d.getFullYear()}-${mStr}-${dStr}`;
            
            const matchedEntry = allEntries.find(e => {
              const ed = new Date(e.created_at);
              const emStr = String(ed.getMonth() + 1).padStart(2, '0');
              const edStr = String(ed.getDate()).padStart(2, '0');
              return `${ed.getFullYear()}-${emStr}-${edStr}` === dateStrMatch;
            });
            const isToday = d.toDateString() === new Date().toDateString();
            const isSelected = (entryId && matchedEntry?.id === entryId) || (!entryId && targetDateStr === dateStrMatch);

            return (
              <div
                key={dateStrMatch}
                onClick={() => {
                  if (matchedEntry) router.push(`/?id=${matchedEntry.id}`);
                  else router.push(`/?date=${dateStrMatch}`);
                }}
                className={`flex flex-col items-center justify-center w-12 h-14 rounded cursor-pointer transition-all border
                          ${isSelected ? "border-[var(--az-light)] bg-[var(--az-accent)] shadow-[0_0_8px_var(--t-glow)] text-[var(--az-lightest)]" :
                    isToday ? "border-[var(--az-light)] bg-[rgba(145,186,214,0.05)] text-[var(--az-lightest)]" :
                      matchedEntry ? "border-transparent bg-[var(--az-dark)] text-[var(--az-lightest)] hover:bg-[var(--az-accent)]" :
                        "border-transparent hover:bg-[rgba(145,186,214,0.1)] text-[var(--t-dim)] hover:text-[var(--az-lightest)]"
                  }
                      `}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1">
                  {d.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div className="text-sm font-bold font-mono">
                  {d.getDate()}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <hr style={{ marginTop: 20, marginBottom: 20 }}></hr>
      {/* ── Previous output ─────────────────────── */}
      <div className="output-line">
        <span className="cmd">~</span>{" "}
        <span className="comment">
          {entryId ? "# Appending to saved journal entry" : targetDateStr ? `# Creating retroactive entry for ${targetDateStr}` : "# Welcome to Oden's Journal"}
        </span>
      </div>
      <div className="output-line">
        <span className="cmd">~</span>{" "}
        <span className="comment">
          # Write your thoughts below. Press Ctrl+Enter to save.
        </span>
      </div>

      <br />

      {/* ── Existing Content ─────────────────────── */}
      {existingContent && (
        <div className="mb-4 text-[13.5px]" style={{ color: "var(--az-lightest)", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
          {existingContent}
        </div>
      )}

      {/* ── Prompt ──────────────────────────────── */}
      <div className="prompt-row">
        <span className="prompt-user">oden</span>
        <span className="prompt-at">@</span>
        <span className="prompt-host">journal</span>
        <span className="prompt-path">~/entries{entryId ? `/append/${entryId.slice(0, 6)}` : targetDateStr ? `/${targetDateStr}` : ""}</span>
        <span className="prompt-git"> (main)</span>
      </div>

      {/* ── Textarea ────────────────────────────── */}
      <div className="terminal-textarea-wrapper">
        <textarea
          id="journal-input"
          className="terminal-textarea"
          placeholder="start writing your new entry..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          onKeyDown={(e) => {
            if (e.ctrlKey && e.key === "Enter") saveEntry();
          }}
          autoFocus
          autoComplete="off"
          spellCheck={false}
        />
        <div className="btn-row">
          <button
            className="close-btn"
            onClick={() => {
              if (entryId || targetDateStr) {
                router.push("/");
              } else {
                setEntry("");
                setExistingContent("");
                setEntryId(null);
                setTargetDateStr(null);
              }
            }}
            disabled={!entry && !entryId && !targetDateStr}
          >
            ✕ close
          </button>
          <button
            className="save-btn"
            onClick={saveEntry}
            disabled={!entry.trim() || saving}
          >
            {saving ? "saving..." : "⏎ save entry"}
          </button>
        </div>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div style={{ color: "var(--az-light)", padding: "20px" }}>Loading journal...</div>}>
      <JournalEditor />
    </Suspense>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-value">{value}</span>
    </div>
  );
}

