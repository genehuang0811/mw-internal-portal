"use client";

import { useRef, useState } from "react";
import { Camera, X } from "lucide-react";

const MAX_DIM = 1100;
const QUALITY = 0.6;

/** Resize an image file to a compact JPEG data URL (client-side, no upload). */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("decode failed"));
      img.onload = () => {
        const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no ctx"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", QUALITY));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * A single labeled photo slot. Captures from camera/file, resizes client-side,
 * and reports a compact JPEG data URL via onChange. Embedded in the PDF later.
 */
export function PhotoInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (dataUrl: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      onChange(await fileToDataUrl(file));
    } catch {
      onChange("");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <p className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
        {label}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onPick}
        className="hidden"
      />
      {value ? (
        <div className="relative overflow-hidden rounded-md border border-zinc-300 dark:border-zinc-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className="h-24 w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label={`Remove ${label}`}
            className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900/80 text-white"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex h-24 w-full flex-col items-center justify-center gap-1 rounded-md border border-dashed border-zinc-300 bg-zinc-50 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <Camera className="h-5 w-5" aria-hidden="true" />
          {busy ? "Processing…" : "Add photo"}
        </button>
      )}
    </div>
  );
}
