"use client";

import { useEffect, useState } from "react";

type Tenant = {
  id: string;
  name?: string | null;
  whatsapp_number?: string | null;
  plan_code?: string | null;
  billing_status?: string | null;
  trial_end_at?: string | null;
  is_paused: boolean;
  created_at?: string | null;
};

export default function AdminTenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

      // Refresh the list
      await loadTenants();
    } catch (err: any) {
      console.error("Update pause error:", err);
      setError(err.message || "Failed to update tenant status");
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">
              Enatalk Admin – Tenants
            </h1>
            <p className="text-sm text-zinc-500">
              Manage tenant status, pause abusive users, and monitor trials.
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

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && tenants.length === 0 ? (
          <p className="text-sm text-zinc-500">Loading tenants…</p>
        ) : tenants.length === 0 ? (
          <p className="text-sm text-zinc-500">No tenants found.</p>
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
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((t) => {
                  const trialLabel = t.trial_end_at
                    ? new Date(t.trial_end_at).toLocaleDateString()
                    : "–";

                  const isBusy = actionLoadingId === t.id;

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
                          <span className="text-xs text-zinc-500">
                            {t.id}
                          </span>
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
