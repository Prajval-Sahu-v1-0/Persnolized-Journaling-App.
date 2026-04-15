"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

const PALETTE = [
  "#1E3F66",
  "#2E5984",
  "#528AAE",
  "#73A5C6",
  "#91BAD6",
  "#BCD2E8",
];

export default function Home() {
  const [entry, setEntry] = useState("");

  const [saving, setSaving] = useState(false);

  const saveEntry = useCallback(async () => {
    if (!entry.trim() || saving) return;
    setSaving(true);
    try {
      await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: entry }),
      });
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  }, [entry, saving]);

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {/* ── Neofetch ────────────────────────────── */}
      <div className="neofetch">
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
          <InfoRow label="Date: " value={dateStr} />
          <InfoRow label="Uptime: " value="always on" />
          <InfoRow label="Shell: " value="oden-sh 1.0" />
          <InfoRow label="DB: " value="SQLite 3.45 (journal.db)" />
          <InfoRow label="Entries: " value="loading..." />
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

      <hr className="term-divider" />

      {/* ── Previous output ─────────────────────── */}
      <div className="output-line">
        <span className="cmd">~</span>{" "}
        <span className="comment"># Welcome to Oden&apos;s Journal</span>
      </div>
      <div className="output-line">
        <span className="cmd">~</span>{" "}
        <span className="comment">
          # Write your thoughts below. Press Ctrl+Enter to save.
        </span>
      </div>

      <br />

      {/* ── Prompt ──────────────────────────────── */}
      <div className="prompt-row">
        <span className="prompt-user">oden</span>
        <span className="prompt-at">@</span>
        <span className="prompt-host">journal</span>
        <span className="prompt-path">~/entries</span>
        <span className="prompt-git"> (main)</span>
      </div>

      {/* ── Textarea ────────────────────────────── */}
      <div className="terminal-textarea-wrapper">
        <textarea
          id="journal-input"
          className="terminal-textarea"
          placeholder="start writing your journal entry..."
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
            onClick={() => setEntry("")}
            disabled={!entry}
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-value">{value}</span>
    </div>
  );
}
