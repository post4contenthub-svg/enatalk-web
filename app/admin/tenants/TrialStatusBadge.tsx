"use client";

type TenantForBadge = {
  trial_end_at?: string | null;
  trial_expiry_notified_at?: string | null;
  billing_status?: string | null;
  is_paused: boolean;
};

function getTrialStatus(tenant: TenantForBadge) {
  const now = new Date();

  if (!tenant.trial_end_at) {
    return {
      label: "No trial",
      color: "bg-gray-200 text-gray-700",
    };
  }

  const expiry = new Date(tenant.trial_end_at);
  const notified = !!tenant.trial_expiry_notified_at;

  if (expiry < now) {
    return {
      label: notified ? "Expired (notified)" : "Expired",
      color: "bg-red-200 text-red-800",
    };
  }

  const diffDays =
    (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays <= 3) {
    return {
      label: "Expiring soon",
      color: "bg-amber-200 text-amber-800",
    };
  }

  if (tenant.billing_status === "trialing") {
    return {
      label: "Trial active",
      color: "bg-emerald-200 text-emerald-800",
    };
  }

  return {
    label: "Active",
    color: "bg-emerald-100 text-emerald-800",
  };
}

export function TrialStatusBadge({ tenant }: { tenant: TenantForBadge }) {
  const status = getTrialStatus(tenant);

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}
    >
      {status.label}
    </span>
  );
}
