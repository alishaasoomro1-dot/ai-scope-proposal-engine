"use client";
import { useState } from "react";
import { btnGhost } from "./Ui";

export default function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" className={btnGhost} onClick={async () => { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); }}>
      <span aria-live="polite">{done ? "Copied" : "Copy"}</span>
    </button>
  );
}
