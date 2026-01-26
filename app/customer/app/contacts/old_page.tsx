"use client";

import React, { useState } from "react";

type Contact = {
  id: string;
  name: string;
  phone: string;
  city?: string;
  orderId?: string;
  tags?: string[];
  lastActivity?: string;
  optedOut?: boolean;
};

const initialContacts: Contact[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    phone: "919800000000",
    city: "Kolkata",
    orderId: "ORD-101",
    tags: ["New lead", "Website"],
    lastActivity: "Today, 11:22 AM",
    optedOut: false,
  },
  {
    id: "2",
    name: "Ananya Verma",
    phone: "919811112222",
    city: "Delhi",
    orderId: "ORD-102",
    tags: ["Customer"],
    lastActivity: "Yesterday, 4:05 PM",
    optedOut: false,
  },
];

export default function ContactsPage() {
  const [contacts] = useState<Contact[]>(initialContacts);
  const [showNewModal, setShowNewModal] = useState(false);

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Contacts</h1>
          <p className="text-xs text-slate-500">
            Upload leads and manage the people you send WhatsApp messages to.
          </p>
        </div>

        <div className="flex gap-2">
          <button className="rounded-lg border px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
            Import from CSV
          </button>
          <button
            className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-600"
            onClick={() => setShowNewModal(true)}
          >
            + New contact
          </button>
        </div>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3 text-xs">
        <div className="rounded-full bg-slate-100 px-3 py-1">
          Total contacts: <span className="font-semibold">{contacts.length}</span>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
          Opted-in:{" "}
          <span className="font-semibold">
            {contacts.filter((c) => !c.optedOut).length}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">City</th>
              <th className="px-3 py-2">Order ID</th>
              <th className="px-3 py-2">Tags</th>
              <th className="px-3 py-2">Last activity</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td className="px-3 py-2 text-xs text-slate-800">
                  {contact.name || (
                    <span className="italic text-slate-400">No name</span>
                  )}
                </td>
                <td className="px-3 py-2 text-xs text-slate-700">
                  {contact.phone}
                </td>
                <td className="px-3 py-2 text-xs text-slate-600">
                  {contact.city || "-"}
                </td>
                <td className="px-3 py-2 text-xs text-slate-600">
                  {contact.orderId || "-"}
                </td>
                <td className="px-3 py-2 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {contact.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                    {!contact.tags?.length && (
                      <span className="text-[10px] italic text-slate-400">
                        No tags
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 text-xs text-slate-500">
                  {contact.lastActivity || "-"}
                </td>
                <td className="px-3 py-2 text-right text-xs">
                  <button className="mr-1 rounded border px-2 py-1 text-[10px] text-slate-700 hover:bg-slate-50">
                    Edit
                  </button>
                  <button className="rounded border px-2 py-1 text-[10px] text-slate-700 hover:bg-slate-50">
                    Send test
                  </button>
                </td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-6 text-center text-xs text-slate-400"
                >
                  No contacts yet. Import a CSV file or create your first contact.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* New contact modal (UI only for now) */}
      {showNewModal && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">New contact</h2>
              <button
                className="text-xs text-slate-500 hover:text-slate-700"
                onClick={() => setShowNewModal(false)}
              >
                Close
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("In real app this will save to Supabase 👍");
                setShowNewModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div className="space-y-1">
                <label className="block text-slate-600">Name</label>
                <input
                  type="text"
                  className="w-full rounded-lg border px-2 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="Customer name"
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
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-slate-600">City</label>
                <input
                  type="text"
                  className="w-full rounded-lg border px-2 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="e.g. Kolkata"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-slate-600">Order ID</label>
                <input
                  type="text"
                  className="w-full rounded-lg border px-2 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="e.g. ORD-123"
                />
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-lg border px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                  onClick={() => setShowNewModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600"
                >
                  Save contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
