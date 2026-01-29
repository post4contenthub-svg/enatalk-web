"use client";

import { useState, FormEvent } from "react";

type FieldDef = {
  key: string;
  label: string;
  required?: boolean;
};

type Props = {
  tenantId: string;
  fieldDefs: FieldDef[];
};

export default function ImportCsvButton({ tenantId, fieldDefs }: Props) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) {
      window.alert("Please choose a CSV file first.");
      return;
    }

    try {
      setLoading(true);

      const text = await file.text();

      const res = await fetch("/api/customer/contacts/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId,
          csvText: text,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          json?.error || `Import failed (HTTP ${res.status.toString()})`;
        window.alert(msg);
        return;
      }

      const imported = json?.imported ?? 0;
      const skipped = json?.skipped ?? 0;

      window.alert(
        `CSV import completed.\nImported: ${imported}\nSkipped: ${skipped}`
      );
      setOpen(false);
      setFile(null);

      // Reload contacts to show new rows
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      window.alert(err?.message || "Unexpected error during CSV import");
    } finally {
      setLoading(false);
    }
  }

  // avoid repeating phone/name if they exist in fieldDefs
  const customKeys = fieldDefs
    .map((f) => f.key)
    .filter((k) => k !== "phone" && k !== "name");

  const exampleHeader = ["phone", "name", ...customKeys].join(",");

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-slate-600 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700"
      >
        Import from CSV
      </button>

      {/* Simple modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="w-full max-w-lg rounded-xl bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Import contacts from CSV</h2>
              <button
                type="button"
                onClick={() => !loading && setOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-medium">CSV file</label>
                <input
  type="file"
  accept=".csv,text/csv"
  className="block w-full cursor-pointer rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 file:mr-2 file:rounded file:border-0 file:bg-slate-800 file:px-3 file:py-1 file:text-white hover:file:bg-slate-900"
  onChange={(e) => {
    const f = e.target.files?.[0] ?? null;
    console.log("Selected CSV:", f);
    setFile(f);
  }}
/>
                <p className="text-[11px] text-slate-500">
                  Make sure your CSV has a <code>phone</code> column. Optional
                  columns: <code>name</code> and any custom field keys shown
                  below.
                </p>
              </div>

              <div className="rounded-md bg-slate-50 p-2 text-[11px]">
                <div className="mb-1 font-semibold">Expected columns</div>
                <div className="flex flex-wrap gap-1">
                  <span className="rounded bg-slate-200 px-2 py-0.5 font-mono">
                    phone
                  </span>
                  <span className="rounded bg-slate-200 px-2 py-0.5 font-mono">
                    name
                  </span>
                  {customKeys.map((key) => (
                    <span
                      key={key}
                      className="rounded bg-slate-200 px-2 py-0.5 font-mono"
                    >
                      {key}
                    </span>
                  ))}
                </div>
                <p className="mt-1">
                  Example header row: <code>{exampleHeader}</code>
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setOpen(false)}
                  className="rounded border px-3 py-1 text-[11px] text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  // ✅ only disable while loading now
                  disabled={loading}
                  className="rounded bg-emerald-600 px-3 py-1 text-[11px] font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {loading ? "Importing..." : "Start import"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
