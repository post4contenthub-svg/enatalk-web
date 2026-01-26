"use client";

import React, { useState } from "react";

export function NewContactButton() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [orderId, setOrderId] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) {
      alert("WhatsApp number is required");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/customer/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          city,
          order_id: orderId,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        console.error("Create contact failed:", json);
        alert(json.message || "Failed to create contact");
        return;
      }

      // Success
      setOpen(false);
      setName("");
      setPhone("");
      setCity("");
      setOrderId("");

      // For now: simple reload to see new row
      window.location.reload();
    } catch (err) {
      console.error("Create contact error:", err);
      alert("Unexpected error, please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-600"
        onClick={() => setOpen(true)}
      >
        + New contact
      </button>

      {open && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-lg text-xs">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">New contact</h2>
              <button
                className="text-xs text-slate-500 hover:text-slate-700"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-slate-600">Name</label>
                <input
                  type="text"
                  className="w-full rounded-lg border px-2 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="Customer name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-slate-600">
                  WhatsApp number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  className="w-full rounded-lg border px-2 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="e.g. 9198XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-slate-600">City</label>
                <input
                  type="text"
                  className="w-full rounded-lg border px-2 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="e.g. Kolkata"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-slate-600">Order ID</label>
                <input
                  type="text"
                  className="w-full rounded-lg border px-2 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="e.g. ORD-123"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-lg border px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600 disabled:opacity-60"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Save contact"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
