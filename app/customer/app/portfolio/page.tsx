"use client";

export default function CustomerPortfolioPage() {
  const business = {
    name: "Lucy’s Creations",
    industry: "Bakery & Cakes",
    whatsapp: "+91 XXXXXXX210",
    city: "Kolkata",
    pincode: "700091",
    joined: "Jan 2026",
    plan: "Starter",
    birthdayAutomation: true,
    messagesSent: 1240,
    templates: 3,
    campaigns: 5,
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">
          🏢 Customer Portfolio
        </h1>
        <p className="text-sm text-slate-400">
          Overview of your business profile and EnaTalk usage
        </p>
      </div>

      {/* Business Profile Card */}
      <div className="rounded-xl bg-slate-800 border border-slate-700 p-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-medium text-white">
              {business.name}
            </h2>
            <p className="text-sm text-slate-400">
              {business.industry}
            </p>
          </div>

          <span className="rounded-full bg-emerald-600/20 text-emerald-400 px-3 py-1 text-xs font-medium">
            {business.plan} Plan
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">
          <Info label="📱 WhatsApp" value={business.whatsapp} />
          <Info label="📍 City" value={business.city} />
          <Info label="📮 Pincode" value={business.pincode} />
          <Info label="📅 Joined" value={business.joined} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Messages Sent" value={business.messagesSent} />
        <StatCard label="Templates" value={business.templates} />
        <StatCard label="Campaigns" value={business.campaigns} />
        <StatCard
          label="Birthday Automation"
          value={business.birthdayAutomation ? "Enabled" : "Disabled"}
          highlight={business.birthdayAutomation}
        />
      </div>

      {/* Automation Preview */}
      <div className="rounded-xl bg-slate-800 border border-slate-700 p-5">
        <h3 className="text-white font-medium mb-2">
          🎂 Birthday Automation
        </h3>

        {business.birthdayAutomation ? (
          <p className="text-sm text-emerald-400">
            Enabled and running automatically
          </p>
        ) : (
          <p className="text-sm text-red-400">
            Not enabled
          </p>
        )}

        <div className="mt-3 text-sm text-slate-200 whitespace-pre-line">
          🎉 Happy Birthday {{name}}! 🎂
          Wishing you a wonderful year ahead.
          — {business.name}
        </div>
      </div>
    </div>
  );
}

/* Reusable components */

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between sm:justify-start sm:gap-2">
      <span className="text-slate-400">{label}:</span>
      <span className="text-slate-200">{value}</span>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 border ${
        highlight
          ? "border-emerald-600 bg-slate-800"
          : "border-slate-700 bg-slate-800"
      }`}
    >
      <p className="text-xs text-slate-400">{label}</p>
      <p
        className={`text-lg font-semibold ${
          highlight ? "text-emerald-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
