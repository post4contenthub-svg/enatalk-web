"use client";

import React, { useEffect, useMemo, useState } from "react";

export const dynamic = "force-dynamic"; // keep messages always fresh

type Message = {
  id: string;
  tenant_id?: string | null;
  direction: "inbound" | "outbound";
  to_number: string | null;
  from_number: string | null;
  body_text: string | null;
  status: string | null;
  created_at: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchNumber, setSearchNumber] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/admin/messages");
        if (!res.ok) {
          throw new Error(`Failed to load messages: ${res.status}`);
        }

        const json = await res.json();
        const msgs: Message[] = Array.isArray(json)
          ? json
          : json.messages ?? [];
        setMessages(msgs);
      } catch (err) {
        console.error("Failed to load messages", err);
        setError("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredMessages = useMemo(() => {
    if (!searchNumber.trim()) return messages;
    const q = searchNumber.trim();
    return messages.filter((m) => {
      const to = m.to_number ?? "";
      const from = m.from_number ?? "";
      return to.includes(q) || from.includes(q);
    });
  }, [messages, searchNumber]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">Messages</h1>
          <p className="text-xs text-zinc-500">
            View recent WhatsApp messages across all tenants. Use the search
            box to filter by phone number.
          </p>
        </div>

        <input
          type="text"
          value={searchNumber}
          onChange={(e) => setSearchNumber(e.target.value)}
          placeholder="Search by number (e.g. 91...)"
          className="w-64 rounded-full border border-zinc-200 px-3 py-1.5 text-xs outline-none placeholder:text-zinc-400 focus:border-zinc-400"
        />
      </div>

      {loading ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 text-sm text-zinc-500">
          Loading messages…
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 text-sm text-zinc-500">
          {searchNumber
            ? "No messages found for this number."
            : "No messages found yet."}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <table className="min-w-full border-collapse text-left text-xs">
            <thead className="bg-zinc-50 text-[11px] uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-3 py-2">Direction</th>
                <th className="px-3 py-2">To</th>
                <th className="px-3 py-2">From</th>
                <th className="px-3 py-2">Body</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Created at</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredMessages.map((m) => (
                <tr key={m.id} className="hover:bg-zinc-50">
                  <td className="px-3 py-2 text-[11px] font-medium">
                    {m.direction === "outbound" ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">
                        Outbound
                      </span>
                    ) : (
                      <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] text-sky-700">
                        Inbound
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-[11px] text-zinc-700">
                    {m.to_number ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-[11px] text-zinc-700">
                    {m.from_number ?? "—"}
                  </td>
                  <td className="max-w-xs px-3 py-2 text-[11px] text-zinc-700">
                    {m.body_text ?? ""}
                  </td>
                  <td className="px-3 py-2 text-[11px] text-zinc-500">
                    {m.status ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-[11px] text-zinc-500">
                    {new Date(m.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
