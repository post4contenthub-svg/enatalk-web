"use client";

import { useState } from "react";
import NewTemplateModal from "./NewTemplateModal";

export default function TemplatesClient({
  tenantId,
}: {
  tenantId: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded bg-blue-600 px-3 py-2 text-xs text-white"
      >
        + New Template
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