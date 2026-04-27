"use client";

import { useState } from "react";

export default function BirthdayTemplatePage() {
  // 🔹 Later replace this with Supabase tenant data
  const businessName = "Your Business";

  const [enabled, setEnabled] = useState(false);
  const [editing, setEditing] = useState(false);

  const [message, setMessage] = useState(
    `🎉 Happy Birthday {{name}}! 🎂
Wishing you a wonderful year ahead.
— {{business_name}}`
  );

  // 🔹 Preview only (real sending should replace variables server-side)
  const previewMessage = message.replace(
    "{{business_name}}",
    businessName
  );

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">
          🎂 Birthday Automation
        </h1>
        <p className="text-sm text-slate-400">
          Automatically send birthday wishes to your contacts every year.
        </p>
      </div>

      {/* Status Card */}
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Birthday Messages</p>
            <p className="text-xs text-slate-400">
              Status:{" "}
              <span className={enabled ? "text-emerald-400" : "text-red-400"}>
                {enabled ? "Enabled" : "Disabled"}
              </span>
            </p>
          </div>

          <button
            onClick={() => setEnabled(!enabled)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition
              ${
                enabled
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-slate-700 hover:bg-slate-600"
              }
            `}
          >
            {enabled ? "Turn Off" : "Turn On"}
          </button>
        </div>

        {!enabled && (
          <p className="text-xs text-yellow-400">
            ⚠ Turn ON to activate automatic birthday messages
          </p>
        )}
      </div>

      {/* Message Template Card */}
      <div
        className={`rounded-xl border p-5 space-y-4 ${
          enabled
            ? "border-emerald-600 bg-slate-800"
            : "border-slate-700 bg-slate-800"
        }`}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-white">Message Template</h2>

          <button
            onClick={() => setEditing(!editing)}
            className="text-sm text-emerald-400 hover:underline"
          >
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        {!editing ? (
          <p className="whitespace-pre-line text-slate-200 text-sm">
            {previewMessage}
          </p>
        ) : (
          <div className="space-y-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />

            <p className="text-xs text-slate-400">
              Available variables:{" "}
              <span className="text-slate-200">{"{{name}}"}</span>,{" "}
              <span className="text-slate-200">
                {"{{business_name}}"}
              </span>
            </p>

            <p className="text-xs text-slate-500">
              <strong>{"{{business_name}}"}</strong> is taken from your business
              profile settings.
            </p>

            <button
              onClick={() => setEditing(false)}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
            >
              Save Message
            </button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-xs text-slate-500">
        Messages are sent once per year on the contact’s birthday to avoid spam.
      </div>
    </div>
  );
}
