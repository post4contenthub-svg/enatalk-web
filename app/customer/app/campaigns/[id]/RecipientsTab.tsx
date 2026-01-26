"use client";

import { useEffect, useState } from "react";

type Recipient = {
  phone: string;
  status: "sent" | "failed";
  error: string | null;
  sent_at: string;
};

export default function RecipientsTab({
  campaignId,
}: {
  campaignId: string;
}) {
  const [status, setStatus] = useState<"all" | "sent" | "failed">("all");
  const [data, setData] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const res = await fetch(
        `/customer/api/customer/campaigns/${campaignId}/recipients?status=${status}`
      );

      const json = await res.json();
      setData(json.recipients || []);
      setLoading(false);
    }

    load();
  }, [campaignId, status]);

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-3">Recipients</h3>

      <div className="flex gap-2 mb-4">
        {["all", "sent", "failed"].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s as any)}
            className={`px-3 py-1 rounded text-sm border ${
              status === s
                ? "bg-emerald-600 text-white"
                : "bg-white"
            }`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Error</th>
              <th className="p-2 text-left">Sent at</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No recipients
                </td>
              </tr>
            )}

            {data.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{r.phone}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      r.status === "sent"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="p-2 text-red-600">
                  {r.error || "—"}
                </td>
                <td className="p-2">
                  {new Date(r.sent_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
