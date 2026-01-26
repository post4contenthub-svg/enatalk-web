// app/(customer)/app/page.tsx
import React from "react";

export default function OverviewPage() {
  // 🔮 Later we will replace this with real data from Supabase
  const fakeStats = {
    trialEndsOn: "7 Dec 2025",
    trialStatus: "Trialing",
    messagesThisMonth: 230,
    monthlyQuota: 1000,
  };

  const usagePercent =
    (fakeStats.messagesThisMonth / fakeStats.monthlyQuota) * 100;

  const recentMessages = [
    {
      id: "1",
      to: "+91 98765 43210",
      template: "Welcome – New Lead",
      status: "Sent",
      time: "Today, 10:21 AM",
    },
    {
      id: "2",
      to: "+91 99887 76655",
      template: "Flash Sale – 20% OFF",
      status: "Delivered",
      time: "Yesterday, 5:02 PM",
    },
    {
      id: "3",
      to: "+91 90000 11111",
      template: "Cart Reminder",
      status: "Failed",
      time: "Yesterday, 3:44 PM",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top row: Trial + Usage */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Trial status card */}
        <div className="col-span-1 rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Trial status</h2>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
              {fakeStats.trialStatus}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Your EnaTalk trial ends on{" "}
            <span className="font-medium text-slate-700">
              {fakeStats.trialEndsOn}
            </span>
            . After that, sending will be paused automatically.
          </p>
          <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
            Tip: Use this time to send a few test campaigns to your own number
            and see how it feels.
          </div>
        </div>

        {/* Usage card */}
        <div className="col-span-1 rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold">Message usage</h2>
          <p className="text-xs text-slate-500">
            {fakeStats.messagesThisMonth} of {fakeStats.monthlyQuota} trial
            messages used this month.
          </p>
          <div className="mt-3 h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-emerald-500"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-slate-500">
            <span>0</span>
            <span>{fakeStats.messagesThisMonth}</span>
            <span>{fakeStats.monthlyQuota}</span>
          </div>
        </div>

        {/* Account health */}
        <div className="col-span-1 rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold">Account health</h2>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>WhatsApp connection: <b>Connected</b></span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Sending status: <b>Allowed</b></span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-100" />
              <span>Daily sends: <b>8 messages</b> (demo)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom row: Recent activity */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Recent messages */}
        <div className="col-span-2 rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent messages</h2>
            <button className="text-xs font-medium text-emerald-700 hover:underline">
              View all
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border bg-slate-50">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2">To</th>
                  <th className="px-3 py-2">Template</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {recentMessages.map((msg) => (
                  <tr key={msg.id}>
                    <td className="px-3 py-2 text-xs text-slate-700">
                      {msg.to}
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-600">
                      {msg.template}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      <span
                        className={[
                          "rounded-full px-2 py-0.5 text-[10px] font-medium",
                          msg.status === "Sent" || msg.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700",
                        ].join(" ")}
                      >
                        {msg.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-500">
                      {msg.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
{/* Add new field form */}
<form
  onSubmit={handleAddField}
  className="mt-4 flex flex-wrap items-end gap-3 text-xs"
>
  <div className="flex-1 min-w-[150px] space-y-1">
    <label className="block text-slate-600">Field label</label>
    <input
      type="text"
      className="w-full rounded-lg border px-2 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
      placeholder="e.g. City, Policy number, Branch"
      value={newLabel}
      onChange={(e) => setNewLabel(e.target.value)}
      required
    />
  </div>
  <div className="w-48 space-y-1">
    <label className="block text-slate-600">
      Field key <span className="text-slate-400">(optional)</span>
    </label>
    <input
      type="text"
      className="w-full rounded-lg border px-2 py-1.5 text-xs font-mono outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
      placeholder="auto-generated if empty"
      value={newKey}
      onChange={(e) => setNewKey(e.target.value)}
    />
    <p className="text-[10px] text-slate-400">
      Used in templates as {"{{your_key}}"}.
    </p>
  </div>
  <div className="mb-1">
    <button
      type="submit"
      className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600"
    >
      + Add field
    </button>
  </div>
</form>
        {/* Quick actions */}
        <div className="col-span-1 rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold">Get started</h2>
          <div className="space-y-3 text-xs">
            <button className="w-full rounded-lg bg-emerald-500 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-600">
              Create your first campaign
            </button>
            <button className="w-full rounded-lg border px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
              Browse ready-made templates
            </button>
            <button className="w-full rounded-lg border px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
              Import contacts from CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
