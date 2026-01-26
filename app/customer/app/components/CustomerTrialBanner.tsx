"use client";

import { useEffect, useState } from "react";

type TrialStatusResponse = {
  ok: boolean;
  tenant?: {
    id: string;
    name?: string | null;
    billing_status?: string | null;
    plan_code?: string | null;
    is_paused: boolean;
    trial_end_at?: string | null;
    trial_expiry_notified_at?: string | null;
  };
  trial?: {
    status: "no_trial" | "trial_active" | "expiring_soon" | "expired";
    daysLeft: number | null;
  };
};

export function CustomerTrialBanner() {
  const [data, setData] = useState<TrialStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/customer/trial-status", {
          // TEMP: inject tenant id for testing.
          // Replace with your real auth when ready.
          headers: {
            "x-tenant-id": process.env.NEXT_PUBLIC_TEST_TENANT_ID ?? "",
          },
          cache: "no-store",
        });

        const json = (await res.json()) as TrialStatusResponse;
        setData(json);
      } catch (err) {
        console.error("trial banner error:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    load().catch(console.error);
  }, []);

  if (loading) return null;
  if (!data || !data.ok || !data.trial) return null;

  const { status, daysLeft } = data.trial;
  const isPaused = data.tenant?.is_paused;

  let text = "";
  let style =
    "border-zinc-200 bg-zinc-50 text-zinc-700"; // default neutral style

  if (status === "no_trial") {
    return null; // don’t show anything
  }

  if (status === "expired") {
    text =
      "Your trial has expired. Please upgrade to continue sending messages.";
    style = "border-red-200 bg-red-50 text-red-800";
  } else if (status === "expiring_soon") {
    text = `Your trial is expiring soon${
      typeof daysLeft === "number" ? ` (${daysLeft} day(s) left)` : ""
    }. Consider upgrading to avoid interruption.`;
    style = "border-amber-200 bg-amber-50 text-amber-800";
  } else if (status === "trial_active") {
    text = typeof daysLeft === "number"
      ? `Your trial is active. ${daysLeft} day(s) remaining.`
      : "Your trial is active.";
    style = "border-emerald-200 bg-emerald-50 text-emerald-800";
  }

  if (isPaused) {
    text =
      "Your account is currently paused due to trial/plan rules. Please contact support or upgrade.";
    style = "border-red-200 bg-red-50 text-red-800";
  }

  return (
    <div
      className={`mb-4 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs ${style}`}
    >
      <span className="mt-0.5 inline-block h-2 w-2 rounded-full bg-current" />
      <p>{text}</p>
    </div>
  );
}
