"use client";

import { useState } from "react";

type FieldDef = {
  key: string;
  label: string;
};

type Contact = {
  id: string;
  name: string | null;
  phone: string;
  tags: string[] | null;
  is_opted_out: boolean;
  custom_fields: Record<string, any> | null;
  preferred_template_id: string | null;
};

export default function RowActions({
  contact,
  tenantId,
  fieldDefs,
}: {
  contact: Contact;
  tenantId: string;
  fieldDefs: FieldDef[];
}) {
  const [busy, setBusy] = useState(false);

  async function handleEdit() {
    if (busy) return;

    const newPhone = window.prompt("Edit phone:", contact.phone);
    if (newPhone === null) return;

    const newName = window.prompt("Edit name:", contact.name || "") ?? "";
    if (newName === null) return;

    const tagsStr =
      window.prompt(
        "Edit tags (comma separated):",
        (contact.tags || []).join(", ")
      ) ?? "";
    if (tagsStr === null) return;

    const newTags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const newCustom: Record<string, any> = {
      ...(contact.custom_fields || {}),
    };

    for (const def of fieldDefs) {
      const current = contact.custom_fields?.[def.key] ?? "";
      const value = window.prompt(
        `Edit ${def.label}:`,
        current != null ? String(current) : ""
      );
      if (value === null) return;
      newCustom[def.key] = value;
    }

    try {
      setBusy(true);

      const res = await fetch("/api/customer/contacts/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: contact.id,
          tenantId,
          phone: newPhone,
          name: newName,
          tags: newTags,
          custom_fields: newCustom,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "Failed to update contact");
        return;
      }

      alert("Contact updated ✅");
      window.location.reload();
    } catch (err: any) {
      alert(err?.message || "Unexpected error");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (busy) return;

    if (!window.confirm("Delete this contact? This cannot be undone.")) {
      return;
    }

    try {
      setBusy(true);

      const res = await fetch("/api/customer/contacts/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: contact.id,
          tenantId,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "Failed to delete contact");
        return;
      }

      alert("Contact deleted ✅");
      window.location.reload();
    } catch (err: any) {
      alert(err?.message || "Unexpected error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-1">
      <button
        type="button"
        onClick={handleEdit}
        disabled={busy}
        className="rounded-md border px-2 py-1 text-[10px] text-slate-700 hover:bg-slate-50 disabled:opacity-60"
      >
        {busy ? "Working…" : "Edit"}
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={busy}
        className="rounded-md border px-2 py-1 text-[10px] text-rose-700 hover:bg-rose-50 disabled:opacity-60"
      >
        Delete
      </button>
    </div>
  );
}