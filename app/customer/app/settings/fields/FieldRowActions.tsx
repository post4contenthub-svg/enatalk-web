"use client";

type Props = {
  fieldId: string;
  tenantId: string;
};

export default function FieldRowActions({ fieldId, tenantId }: Props) {
  async function handleDelete() {
    const ok = window.confirm(
      "Delete this field? Existing contacts will keep their stored values in custom_fields, but this field will no longer be visible or editable."
    );
    if (!ok) return;

    try {
      const res = await fetch("/api/customer/fields/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, fieldId }),
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
        alert(`Failed to delete field: ${msg}`);
        return;
      }

      alert("Field deleted ✅");
      window.location.reload();
    } catch (err: any) {
      alert(err?.message || "Unexpected error");
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="rounded border px-2 py-0.5 text-[10px] text-rose-600 hover:bg-rose-50"
    >
      Delete
    </button>
  );
}
