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

type PageSize = 25 | 50 | 100 | 200 | "all";

export default function AdminMessagesPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingTenants, setLoadingTenants] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [errorTenants, setErrorTenants] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<string | null>(null);
  const [searchNumber, setSearchNumber] = useState("");

  // pagination
  const [pageSize, setPageSize] = useState<PageSize>(50);
  const [page, setPage] = useState(1);

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
        setPage(1); // reset page when tenant changes
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

  // reset to first page when filter/pageSize changes
  useEffect(() => {
    setPage(1);
  }, [searchNumber, pageSize]);

  // pagination calculations
  const totalMessages = filteredMessages.length;
  const totalPages =
    pageSize === "all"
      ? 1
      : Math.max(1, Math.ceil(totalMessages / pageSize));

  const currentPage = Math.min(page, totalPages);

  const visibleMessages =
    pageSize === "all"
      ? filteredMessages
      : filteredMessages.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        );

  const showingFrom =
    totalMessages === 0
      ? 0
      : pageSize === "all"
      ? 1
      : (currentPage - 1) * (pageSize as number) + 1;
  const showingTo =
    pageSize === "all"
      ? totalMessages
      : Math.min(currentPage * (pageSize as number), totalMessages);

  // 3) Resend handler – calls /api/resend-message
  const resendMessage = async (message: Message) => {
    if (!message.id) return;

    try {
      const res = await fetch("/api/resend-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: message.id }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        console.error("Resend failed:", json);
        const msg =
          json?.message ||
          json?.details?.message ||
          json?.error ||
          "Resend failed";
        alert(msg);
        return;
      }

      alert("Message resent successfully ✅");
    } catch (err) {
      console.error("Resend error:", err);
      alert("Resend request failed");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-zinc-900">Messages</h1>
      <p className="text-xs text-zinc-500">
        Choose a tenant on the left to view all of their WhatsApp messages.
        You can search within that tenant by phone number and control how many
        rows are shown per page.
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

            <div className="flex items-center gap-2">
              {/* Page size dropdown */}
              <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                <span>Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) =>
                    setPageSize(
                      e.target.value === "all"
                        ? "all"
                        : (Number(e.target.value) as PageSize)
                    )
                  }
                  className="h-7 rounded-full border border-zinc-200 bg-white px-2 text-[11px] outline-none focus:border-zinc-400"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                  <option value="all">All</option>
                </select>
              </div>

              {/* Number search */}
              <input
                type="text"
                value={searchNumber}
                onChange={(e) => setSearchNumber(e.target.value)}
                placeholder="Search by number (e.g. 91...)"
                className="w-64 rounded-full border border-zinc-200 px-3 py-1.5 text-xs outline-none placeholder:text-zinc-400 focus:border-zinc-400"
              />
            </div>
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
            <>
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
                      <th className="px-3 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {visibleMessages.map((m) => (
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
                        <td className="px-3 py-2 text-[11px]">
                          {m.direction === "outbound" ? (
                            <button
                              onClick={() => resendMessage(m)}
                              className="rounded-full bg-black px-3 py-1 text-[10px] text-white hover:bg-zinc-800"
                            >
                              Resend
                            </button>
                          ) : (
                            <span className="text-zinc-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination info + controls */}
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500">
                <div>
                  {totalMessages === 0 ? (
                    "No messages."
                  ) : (
                    <>
                      Showing <span className="font-medium">{showingFrom}</span>{" "}
                      – <span className="font-medium">{showingTo}</span> of{" "}
                      <span className="font-medium">{totalMessages}</span>{" "}
                      messages
                    </>
                  )}
                </div>

                {pageSize !== "all" && totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="rounded-full border border-zinc-200 bg-white px-3 py-1 disabled:opacity-40"
                    >
                      Prev
                    </button>
                    <span>
                      Page{" "}
                      <span className="font-medium">{currentPage}</span> of{" "}
                      <span className="font-medium">{totalPages}</span>
                    </span>
                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      className="rounded-full border border-zinc-200 bg-white px-3 py-1 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
