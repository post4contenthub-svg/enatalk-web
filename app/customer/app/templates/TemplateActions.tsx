"use client";

import { useState } from "react";

export default function TemplateActions({
  templateId,
  initialBody,
}: {
  templateId: string;
  initialBody: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBody, setNewBody] = useState(initialBody || "");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (!templateId) {
      alert("Template ID missing. Please refresh the page.");
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch("/api/customer/templates/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: templateId,
          body_text: newBody,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Save failed: ${data.error || "Unknown error"}`);
        return;
      }

      alert("Template updated successfully ✅");
      window.location.reload();
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  // ✏️ EDIT MODE
  if (isEditing) {
    return (
      <div className="flex flex-col gap-2">
        <textarea
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
          className="p-2 text-xs border border-blue-400 rounded w-[250px] min-h-[80px]"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsEditing(false)}
            className="text-xs text-slate-500"
            disabled={isSaving}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-1 text-xs bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    );
  }

  // 👁️ VIEW MODE
  return (
    <button
      onClick={() => setIsEditing(true)}
      className="px-4 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded border border-blue-200"
    >
      Edit
    </button>
  );
}