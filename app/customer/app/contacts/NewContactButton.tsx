"use client";

import { useState } from "react";

type FieldDef = {
  key: string;
  label: string;
  type?: string;
};

export default function NewContactButton({
  tenantId,
  fieldDefs,
}: {
  tenantId: string;
  fieldDefs: FieldDef[];
}) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [tags, setTags] = useState("");
  const [customValues, setCustomValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function handleChangeField(key: string, value: string) {
    setCustomValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!phone.trim()) {
      alert("Phone number is required.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/customer/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId,
          phone: phone.trim(),
          name: name.trim() || null,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          custom_fields: customValues,
        }),
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        // ignore
      }

      if (!res.ok) {
        const msg =
          (json && (json.error || json.message || json.details)) ||
          `Failed with HTTP ${res.status}`;
        alert(`Failed to create contact: ${msg}`);
        return;
      }

      alert("Contact created ✅");
      setOpen(false);
      window.location.reload();
    } catch (err: any) {
      alert(err?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700"
      >
        + New contact
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-lg">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold">New Contact</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-xs text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Phone */}
              <div>
                <label className="text-[11px] text-slate-600">Phone *</label>
                <input
                  className="mt-1 w-full rounded border px-2 py-1"
                  placeholder="e.g. 919812345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Name */}
              <div>
                <label className="text-[11px] text-slate-600">Name</label>
                <input
                  className="mt-1 w-full rounded border px-2 py-1"
                  placeholder="Optional"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="text-[11px] text-slate-600">
                  Tags (comma separated)
                </label>
                <input
                  className="mt-1 w-full rounded border px-2 py-1"
                  placeholder="New lead, Website"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              {/* Dynamic custom fields */}
              {fieldDefs.map((field) => {
                const inputType =
                  field.type === "number"
                    ? "number"
                    : field.type === "date"
                    ? "date"
                    : "text";

                return (
                  <div key={field.key}>
                    <label className="text-[11px] text-slate-600">
                      {field.label}
                    </label>
                    <input
                      type={inputType}
                      className="mt-1 w-full rounded border px-2 py-1"
                      value={customValues[field.key] || ""}
                      onChange={(e) =>
                        handleChangeField(field.key, e.target.value)
                      }
                    />
                  </div>
                );
              })}

              <button
                onClick={handleSave}
                disabled={loading}
                className="mt-3 w-full rounded bg-emerald-600 py-2 text-white disabled:opacity-60"
              >
                {loading ? "Saving…" : "Save Contact"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
