"use client";

import { useState } from "react";

type Template = {
  id: string;
  name: string;
  body_text: string;
};

type Props = {
  phone: string;
  tenantId: string;
  preferredTemplateId?: string | null;
};

export function SendTemplateButton({
  phone,
  tenantId,
  preferredTemplateId,
}: Props) {
  const [loading, setLoading] = useState(false);

  const hasPhone = !!phone && phone.trim().length > 0;

  async function handleClick() {
    if (!hasPhone) {
      window.alert("This contact does not have a valid phone number.");
      return;
    }

    try {
      setLoading(true);

      // 1) Load templates for this tenant
      const res = await fetch(
        `/api/customer/templates/list?tenantId=${encodeURIComponent(
          tenantId
        )}`
      );

      const text = await res.text();
      let json: any = null;
      try {
        json = JSON.parse(text);
      } catch {
        // not JSON – unexpected
      }

      if (!res.ok) {
        const msg =
          (json && (json.error || json.message)) ||
          text ||
          `Failed with HTTP ${res.status}`;
        window.alert(`Failed to load templates: ${msg}`);
        return;
      }

      const templates: Template[] = json?.templates ?? [];

      if (!templates.length) {
        window.alert("No active templates found for this workspace.");
        return;
      }

      // 2) Choose template
      let chosen: Template | null = null;

      // 2a) If contact has a preferred template, try to use it automatically
      if (preferredTemplateId) {
        chosen =
          templates.find((t) => t.id === preferredTemplateId) || null;
      }

      // 2b) Otherwise let user pick a template
      if (!chosen) {
        const options = templates
          .map((t, i) => `${i + 1}. ${t.name}`)
          .join("\n");

        const choiceStr = window.prompt(
          `Choose a template number:\n\n${options}\n\nEnter number:`,
          "1"
        );

        if (!choiceStr) return;

        const choice = parseInt(choiceStr, 10);
        if (Number.isNaN(choice) || choice < 1 || choice > templates.length) {
          window.alert("Invalid template selection.");
          return;
        }

        chosen = templates[choice - 1];
      }

      // 3) Allow quick edit before sending
      const editedBody =
        window.prompt("Edit message before sending:", chosen.body_text) ??
        chosen.body_text;

      if (!editedBody.trim()) {
        // cancelled or cleared
        return;
      }

      // 4) Send WhatsApp using existing send API
      const sendRes = await fetch("/api/customer/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          body: editedBody.trim(),
          tenantId,
        }),
      });

      let sendJson: any = null;
      try {
        sendJson = await sendRes.json();
      } catch {
        // ignore
      }

      if (!sendRes.ok) {
        console.error("Send via template error:", sendJson);
        const msg =
          (sendJson && (sendJson.error || sendJson.message)) ||
          `Failed to send (HTTP ${sendRes.status})`;
        window.alert(`Failed to send message: ${msg}`);
        return;
      }

      window.alert("Template message sent successfully ✅");
    } catch (err: any) {
      console.error(err);
      window.alert(err?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || !hasPhone}
      className="rounded-md border px-2 py-1 text-[10px] font-medium text-slate-800 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
      title={
        !hasPhone
          ? "No phone number for this contact"
          : "Send WhatsApp using a template"
      }
    >
      {loading ? "Sending..." : "Send via template"}
    </button>
  );
}
