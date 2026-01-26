"use client";
import { TrialStatusBadge } from "./tenants/TrialStatusBadge";
import { useEffect, useMemo, useState } from "react";

type Tenant = {
  id: string;
  name?: string | null;
  whatsapp_number?: string | null;
  plan_code?: string | null;
  billing_status?: string | null;
  trial_end_at?: string | null;
  is_paused: boolean;
  created_at?: string | null;
  outbound_count?: number;
  inbound_count?: number;
  last_message_at?: string | null;
};

type StatusFilter = "all" | "active" | "paused";

export default function AdminTenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customDays, setCustomDays] = useState<Record<string, string>>({});
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  async function loadTenants() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/tenants", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to load tenants");
      }

      setTenants(data.tenants || []);
    } catch (err: any) {
      console.error("Load tenants error:", err);
      setError(err.message || "Failed to load tenants");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTenants();
  }, []);

  async function updatePause(tenantId: string, paused: boolean) {
    try {
      setActionLoadingId(tenantId);
      setError(null);

      const url = paused
        ? "/api/admin/tenants/pause"
        : "/api/admin/tenants/resume";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update tenant status");
      }

      await loadTenants();
    } catch (err: any) {
      console.error("Update pause error:", err);
      setError(err.message || "Failed to update tenant status");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function extendTrial(tenantId: string, days: number) {
    try {
      setActionLoadingId(tenantId);
      setError(null);

      const res = await fetch("/api/admin/tenants/extend-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, days }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Failed to extend trial");
      }

      await loadTenants();
    } catch (err: any) {
      console.error("Extend trial error:", err);
      setError(err.message || "Failed to extend trial");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function extendTrialCustom(tenantId: string) {
    const value = customDays[tenantId];
    const days = Number(value);

    if (!value || !Number.isFinite(days) || days <= 0) {
      setError("Please enter a valid positive number of days.");
      return;
    }

    await extendTrial(tenantId, days);
  }

  // ---------- Portfolio stats (at a glance) ----------

  const stats = useMemo(() => {
    const total = tenants.length;
    const active = tenants.filter((t) => !t.is_paused).length;
    const paused = tenants.filter((t) => t.is_paused).length;

    const trialing = tenants.filter(
      (t) => t.billing_status === "trialing" || t.plan_code === "trial",
    ).length;

    const totalOutbound = tenants.reduce(
      (sum, t) => sum + (t.outbound_count ?? 0),
      0,
    );
    const totalInbound = tenants.reduce(
      (sum, t) => sum + (t.inbound_count ?? 0),
      0,
    );

    return {
      total,
      active,
      paused,
      trialing,
      totalOutbound,
      totalInbound,
    };
  }, [tenants]);

  const filteredTenants = useMemo(() => {
    if (statusFilter === "active") {
      return tenants.filter((t) => !t.is_paused);
    }
    if (statusFilter === "paused") {
      return tenants.filter((t) => t.is_paused);
    }
    return tenants;
  }, [tenants, statusFilter]);

  // ---------------------------------------------------

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">
              Enatalk Admin – Tenants
            </h1>
            <p className="text-sm text-zinc-500">
              Portfolio view: see who is active, paused, and how much they send.
            </p>
          </div>
          <button
            onClick={loadTenants}
            disabled={loading}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-100 disabled:opacity-60"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </header>

        {/* Summary cards */}
        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
            <p className="text-xs font-medium uppercase text-zinc-500">
              Total tenants
            </p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900">
              {stats.total}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {stats.trialing} trialing
            </p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-xs font-medium uppercase text-emerald-700">
              Active
            </p>
            <p className="mt-1 text-2xl font-semibold text-emerald-900">
              {stats.active}
            </p>
            <p className="mt-1 text-xs text-emerald-700">
              Sending and not paused
            </p>
          </div>

          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-xs font-medium uppercase text-red-700">
              Paused
            </p>
            <p className="mt-1 text-2xl font-semibold text-red-900">
              {stats.paused}
            </p>
            <p className="mt-1 text-xs text-red-700">
              Blocked by you or auto-rules
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
            <p className="text-xs font-medium uppercase text-zinc-500">
              Messages (all time)
            </p>
            <p className="mt-1 text-xl font-semibold text-zinc-900">
              {stats.totalOutbound} <span className="text-xs">outbound</span>
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {stats.totalInbound} inbound
            </p>
          </div>
        </section>

        {/* Status filter + errors */}
        <section className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white p-1 text-xs font-medium text-zinc-600">
            <button
              onClick={() => setStatusFilter("all")}
              className={`rounded-full px-3 py-1 ${
                statusFilter === "all"
                  ? "bg-zinc-900 text-white"
                  : "hover:bg-zinc-100"
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`rounded-full px-3 py-1 ${
                statusFilter === "active"
                  ? "bg-emerald-600 text-white"
                  : "hover:bg-zinc-100"
              }`}
            >
              Active ({stats.active})
            </button>
            <button
              onClick={() => setStatusFilter("paused")}
              className={`rounded-full px-3 py-1 ${
                statusFilter === "paused"
                  ? "bg-red-600 text-white"
                  : "hover:bg-zinc-100"
              }`}
            >
              Paused ({stats.paused})
            </button>
          </div>
        </section>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Table */}
        {loading && tenants.length === 0 ? (
          <p className="text-sm text-zinc-500">Loading tenants…</p>
        ) : filteredTenants.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No tenants match the selected filter.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs font-medium uppercase text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Tenant</th>
                  <th className="px-4 py-3">WhatsApp</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Billing</th>
                  <th className="px-4 py-3">Trial ends</th>
                  <th className="px-4 py-3 text-center">Outbound</th>
                  <th className="px-4 py-3 text-center">Inbound</th>
                  <th className="px-4 py-3">Last message</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.map((t) => {
                  const trialLabel = t.trial_end_at
                    ? new Date(t.trial_end_at).toLocaleDateString()
                    : "–";

                  const isBusy = actionLoadingId === t.id;
                  const customValue = customDays[t.id] ?? "";

                  const lastMsgLabel = t.last_message_at
                    ? new Date(t.last_message_at).toLocaleString()
                    : "–";

                  const outbound = t.outbound_count ?? 0;
                  const inbound = t.inbound_count ?? 0;

                  return (
                    <tr
                      key={t.id}
                      className="border-t border-zinc-100 hover:bg-zinc-50"
                    >
                      <td className="px-4 py-3 align-middle">
                        <div className="flex flex-col">
                          <span className="font-medium text-zinc-900">
                            {t.name || t.id}
                          </span>
                          <span className="text-xs text-zinc-500">{t.id}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle text-zinc-700">
                        {t.whatsapp_number || "–"}
                      </td>
                      <td className="px-4 py-3 align-middle text-zinc-700">
                        {t.plan_code || "trial"}
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
                          {t.billing_status || "unknown"}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-middle text-zinc-700">
                        {trialLabel}
                      </td>
                      <td className="px-4 py-3 align-middle text-center text-zinc-800">
                        {outbound}
                      </td>
                      <td className="px-4 py-3 align-middle text-center text-zinc-800">
                        {inbound}
                      </td>
                      <td className="px-4 py-3 align-middle text-zinc-700">
                        {lastMsgLabel}
                      </td>
                      <td className="px-4 py-3 align-middle">
                        {t.is_paused ? (
                          <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                            Paused
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 align-middle text-right">
                        <div className="inline-flex items-center gap-2">
                          {t.is_paused ? (
                            <button
                              onClick={() => updatePause(t.id, false)}
                              disabled={isBusy}
                              className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
                            >
                              {isBusy ? "Updating…" : "Resume"}
                            </button>
                          ) : (
                            <button
                              onClick={() => updatePause(t.id, true)}
                              disabled={isBusy}
                              className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-red-700 disabled:opacity-60"
                            >
                              {isBusy ? "Updating…" : "Pause"}
                            </button>
                          )}

                          {/* Quick +7d */}
                          <button
                            onClick={() => extendTrial(t.id, 7)}
                            disabled={isBusy}
                            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-100 disabled:opacity-60"
                          >
                            {isBusy ? "Working…" : "+7d"}
                          </button>

                          {/* Custom days input */}
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min={1}
                              className="w-16 rounded-md border border-zinc-300 px-2 py-1 text-xs text-zinc-800 outline-none focus:border-zinc-900"
                              placeholder="days"
                              value={customValue}
                              onChange={(e) =>
                                setCustomDays((prev) => ({
                                  ...prev,
                                  [t.id]: e.target.value,
                                }))
                              }
                            />
                            <button
                              onClick={() => extendTrialCustom(t.id)}
                              disabled={isBusy}
                              className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
                            >
                              {isBusy ? "Working…" : "Extend"}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
