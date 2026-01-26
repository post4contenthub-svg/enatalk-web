"use client";

import { useState } from "react";
import { SendWhatsAppButton } from "./SendWhatsAppButton";
import { SendTemplateButton } from "./SendTemplateButton";

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

    // Simple prompt-based editing for now
    const newPhone = window.prompt("Edit phone:", contact.phone);
    if (newPhone === null) return; // cancel

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

    // Edit dynamic custom fields
    const newCustom: Record<string, any> = {
      ...(contact.custom_fields || {}),
    };

    for (const def of fieldDefs) {
      const current = contact.custom_fields?.[def.key] ?? "";
      const value = window.prompt(
        `Edit ${def.label}:`,
        current != null ? String(current) : ""
      );
      if (value === null) {
        // if user cancels on any field, abort whole edit
        return;
      }
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
        console.error("Edit contact error:", json);
        alert(json.error || "Failed to update contact");
        return;
      }

      alert("Contact updated ✅");
      window.location.reload();
    } catch (err: any) {
      console.error(err);
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
        console.error("Delete contact error:", json);
        alert(json.error || "Failed to delete contact");
        return;
      }

      alert("Contact deleted ✅");
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Unexpected error");
    } finally {
      setBusy(false);
    }
  }

  const hasPhone = !!contact.phone && contact.phone.trim().length > 0;

  return (
    <div className="flex flex-wrap gap-1">
      {/* existing send buttons (only if subscribed & has phone) */}
      {!contact.is_opted_out && hasPhone && (
        <>
          <SendWhatsAppButton phone={contact.phone} tenantId={tenantId} />
          <SendTemplateButton
            phone={contact.phone}
            tenantId={tenantId}
          />
        </>
      )}

      {/* Edit / Delete controls */}
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
