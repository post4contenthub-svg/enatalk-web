"use client";

import { useState } from "react";
import { SendWhatsAppButton } from "./SendWhatsAppButton";
import { SendTemplateButton } from "./SendTemplateButton";
import EditContactModal from "./EditContactModal";

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
  const [busyDelete, setBusyDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const hasPhone = !!contact.phone && contact.phone.trim().length > 0;

  async function handleDelete() {
    if (busyDelete) return;

    if (
      !window.confirm(
        "Delete this contact? This will remove it permanently."
      )
    ) {
      return;
    }

    try {
      setBusyDelete(true);

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
      setBusyDelete(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-1">
      {/* Existing send buttons, only if subscribed & has phone */}
      {!contact.is_opted_out && hasPhone && (
        <>
          <SendWhatsAppButton phone={contact.phone} tenantId={tenantId} />
          <SendTemplateButton phone={contact.phone} tenantId={tenantId} />
        </>
      )}

      {/* Edit button opens modal */}
      <button
        type="button"
        onClick={() => setShowEdit(true)}
        className="rounded-md border px-2 py-1 text-[10px] text-slate-700 hover:bg-slate-50"
      >
        Edit
      </button>

      {/* Delete button */}
      <button
        type="button"
        onClick={handleDelete}
        disabled={busyDelete}
        className="rounded-md border px-2 py-1 text-[10px] text-rose-700 hover:bg-rose-50 disabled:opacity-60"
      >
        {busyDelete ? "Deleting…" : "Delete"}
      </button>

      {/* Edit modal */}
      {showEdit && (
        <EditContactModal
          contact={contact}
          tenantId={tenantId}
          fieldDefs={fieldDefs}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
}
