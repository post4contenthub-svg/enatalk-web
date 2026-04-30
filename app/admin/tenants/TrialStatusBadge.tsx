"use client";

type TenantForBadge = {
  trial_end_at?: string | null;
  trial_expiry_notified_at?: string | null;
  billing_status?: string | null;
  is_paused: boolean;
};

function getTrialStatus(tenant: TenantForBadge) {
  const now = new Date();
  if (!tenant.trial_end_at) return { label: "No trial", bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" };
  const expiry = new Date(tenant.trial_end_at);
  const notified = !!tenant.trial_expiry_notified_at;
  if (expiry < now) return { label: notified ? "Expired (notified)" : "Expired", bg: "rgba(239,68,68,0.12)", color: "#f87171" };
  const diffDays = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays <= 3) return { label: `Expiring in ${Math.ceil(diffDays)}d`, bg: "rgba(245,184,0,0.12)", color: "#F5B800" };
  if (tenant.is_paused) return { label: "Paused", bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" };
  if (tenant.billing_status === "trialing") return { label: "Trial active", bg: "rgba(34,197,94,0.12)", color: "#22C55E" };
  return { label: "Active", bg: "rgba(34,197,94,0.10)", color: "#22C55E" };
}

export function TrialStatusBadge({ tenant }: { tenant: TenantForBadge }) {
  const s = getTrialStatus(tenant);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", border: `1px solid ${s.color}33` }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.color, flexShrink: 0 }}/>
      {s.label}
    </span>
  );
}
