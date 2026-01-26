"use client";

import { useState } from "react";

type Template = {
  id: string;
  name: string;
};

type Props = {
  contactId: string;
  tenantId: string;
  templates: Template[];
  currentTemplateId: string | null;
};

export function PreferredTemplateDropdown({
  contactId,
  tenantId,
  templates,
  currentTemplateId,
}: Props) {
  const [value, setValue] = useState<string>(currentTemplateId || "");
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newId = e.target.value || null;
    setValue(e.target.value);

    try {
      setLoading(true);
      const res = await fetch("/api/customer/contacts/set-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId,
          tenantId,
          templateId: newId,
        }),
      });

      const text = await res.text();
      let json: any = null;
      try {
        json = JSON.parse(text);
      } catch {
        // ignore
      }

      if (!res.ok) {
        const msg =
          (json && (json.error || json.message)) ||
          text ||
          `Failed with HTTP ${res.status}`;
        alert(`Failed to update template: ${msg}`);
      }
    } catch (err: any) {
      alert(err?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  if (!templates.length) {
    return (
      <span className="text-[10px] italic text-slate-400">
        No templates
      </span>
    );
  }

  return (
    <select
      className="rounded border px-1 py-0.5 text-[10px]"
      value={value}
      onChange={handleChange}
      disabled={loading}
    >
      <option value="">—</option>
      {templates.map((t) => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </select>
  );
}
