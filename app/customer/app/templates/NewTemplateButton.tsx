"use client";

import { useState } from "react";
import NewTemplateModal from "./NewTemplateModal";

export default function NewTemplateButton({
  tenantId,
}: {
  tenantId: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700"
      >
        + New template
      </button>

      {open && (
        <NewTemplateModal
          tenantId={tenantId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}