"use client";

import { useState } from "react";

export default function ImportContactsModal({
  open,
  onClose,
  onImported,
}: {
  open: boolean;
  onClose: () => void;
  onImported: (rows: any[]) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleImport() {
    if (!file) return;

    setLoading(true);

    try {
      const text = await file.text();
      const rows = parseCSV(text);
      onImported(rows);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to import CSV");
    }

    setLoading(false);
  }

  function parseCSV(text: string): any[] {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim());

    return lines.slice(1).map((line) => {
      const values = line.split(",");
      const obj: any = {};
      headers.forEach((h, i) => {
        obj[h] = values[i] ?? "";
      });
      return obj;
    });
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[999]">
      <div className="w-[500px] rounded-xl bg-white p-5 text-sm shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold">Import contacts from CSV</h2>
          <button onClick={onClose} className="text-xs px-2 py-1 border rounded">
            ×
          </button>
        </div>

        {/* File input */}
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mb-3"
        />

        {/* Expected columns */}
        <div className="rounded bg-slate-100 p-2 mb-4 text-xs">
          <p className="font-semibold mb-1">Expected columns</p>
          <p className="text-[11px]">
            phone, name, city, order_id, bike_number, bike_make, bike_model,
            service, washing
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 border rounded text-xs"
          >
            Cancel
          </button>

          <button
            disabled={!file || loading}
            onClick={handleImport}
            className={`px-3 py-1 rounded text-xs text-white ${
              file ? "bg-slate-800 hover:bg-slate-900" : "bg-slate-400"
            }`}
          >
            {loading ? "Importing..." : "Start import"}
          </button>
        </div>
      </div>
    </div>
  );
}
