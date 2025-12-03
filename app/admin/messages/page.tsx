"use client";

import React, { useEffect, useMemo, useState } from "react";

export const dynamic = "force-dynamic";

type Tenant = {
  id: string;
  name: string | null;
  plan_code?: string | null;
  billing_status?: string | null;
  is_paused?: boolean;
  outbound_count?: number;
  inbound_count?: number;
  last_message_at?: string | null;
};

type Message = {
  id: string;
  tenant_id: string | null;
  direction: "inbound" | "outbound";
  to_number: string | null;
  from_number: string | null;
  body_text: string | null;
  status: string | null;
  created_at: string;
};

export default function AdminMessagesPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingTenants, setLoadingTenants] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [errorTenants, setErrorTenants] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<string | null>(null);
  const [searchNumber, setSearchNumber] = useState("");

  // 1) Load tenants
  useEffect(() => {
    const loadTenants = async () => {
      try {
        setLoadingTenants(true);
        setErrorTenants(null);

        const res = await fetch("/api/admin/tenants");
        if (!res.ok) throw new Error(`Failed to load tenants: ${res.status}`);

        const json = await res.json();
        const list: Tenant[] = json.tenants ?? json ?? [];
        setTenants(list);
        if (list.length > 0) {
          setSelectedTenantId(list[0].id);
        }
      } catch (err) {
        console.error("Failed to load tenants", err);
        setErrorTenants("Failed to load tenants");
      } finally {
        setLoadingTenants(false);
      }
    };

    loadTenants();
  }, []);

  // 2) Load messages for selected tenant
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedTenantId) {
        setMessages([]);
        return;
      }

      try {
        setLoadingMessages(true);
        setErrorMessages(null);

        const res = await fetch(
          `/api/admin/messages?tenant_id=${encodeURIComponent(
            selectedTenantId
          )}`
        );
        if (!res.ok) {
          throw new Error(`Failed to load messages: ${res.status}`);
        }

        const json = await res.json();
        const msgs: Message[] = json.messages ?? json ?? [];
        setMessages(msgs);
      } catch (err) {
        console.error("Failed to load messages", err);
        setErrorMessages("Failed to load messages");
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [selectedTenantId]);

  const selectedTenant = useMemo(
    () => tenants.find((t) => t.id === selectedTenantId) ?? null,
    [tenants, selectedTenantId]
  );

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
      <h1 className="text-lg font-semibold text-zinc-900">Messages</h1>
      <p className="text-xs text-zinc-500">
        Choose a tenant on the left to view all of their WhatsApp messages.
        You can search within that tenant by phone number.
      </p>

      <div className="grid grid-cols-[260px,1fr] gap-6">
        {/* Tenants list */}
        <aside className="rounded-xl border border-zinc-200 bg-white p-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Tenants
            </h2>
            <span className="text-[10px] text-zinc-400">
              {tenants.length} total
            </span>
          </div>

          {loadingTenants ? (
            <div className="rounded-md bg-zinc-50 p-3 text-xs text-zinc-500">
              Loading tenants…
            </div>
          ) : errorTenants ? (
            <div className="rounded-md bg-red-50 p-3 text-xs text-red-700">
              {errorTenants}
            </div>
          ) : tenants.length === 0 ? (
            <div className="rounded-md bg-zinc-50 p-3 text-xs text-zinc-500">
              No tenants found.
            </div>
          ) : (
            <ul className="space-y-1 text-xs">
              {tenants.map((t) => {
                const active =
                  selectedTenantId && selectedTenantId === t.id;
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedTenantId(t.id)}
                      className={`w-full rounded-md border px-2 py-2 text-left ${
                        active
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 bg-white hover:bg-zinc-50"
                      }`}
                    >
                      <div className="text-[11px] font-medium">
                        {t.name ?? "Unnamed tenant"}
                      </div>
                      <div
                        className={`mt-1 text-[10px] ${
                          active ? "text-zinc-200" : "text-zinc-500"
                        }`}
                      >
                        Plan: {t.plan_code ?? "—"} ·{" "}
                        {t.billing_status ?? "unknown"}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        {/* Messages for selected tenant */}
        <section className="space-y-3">
          {/* Tenant summary + filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-zinc-900">
                {selectedTenant?.name ?? "No tenant selected"}
              </div>
              {selectedTenant && (
                <div className="text-[11px] text-zinc-500">
                  Plan: {selectedTenant.plan_code ?? "—"} ·{" "}
                  {selectedTenant.billing_status ?? "unknown"}
                </div>
              )}
            </div>

            <input
              type="text"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
              placeholder="Search by number (e.g. 91...)"
              className="w-64 rounded-full border border-zinc-200 px-3 py-1.5 text-xs outline-none placeholder:text-zinc-400 focus:border-zinc-400"
            />
          </div>

          {/* Messages table */}
          {loadingMessages ? (
            <div className="rounded-lg border border-zinc-200 bg-white p-6 text-sm text-zinc-500">
              Loading messages…
            </div>
          ) : errorMessages ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {errorMessages}
            </div>
          ) : !selectedTenantId ? (
            <div className="rounded-lg border border-zinc-200 bg-white p-6 text-sm text-zinc-500">
              Select a tenant on the left to view messages.
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="rounded-lg border border-zinc-200 bg-white p-6 text-sm text-zinc-500">
              {searchNumber
                ? "No messages match this number for this tenant."
                : "No messages found for this tenant."}
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
        </section>
      </div>
    </div>
  );
}
