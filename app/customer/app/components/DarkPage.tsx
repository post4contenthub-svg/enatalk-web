import React from "react";

type DarkPageProps = {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export default function DarkPage({
  title,
  action,
  children,
}: DarkPageProps) {
  return (
    <div className="px-8 py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">
            {title}
          </h1>

          {action ? <div>{action}</div> : null}
        </div>

        {/* Content Card */}
        <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
          {children}
        </div>
      </div>
    </div>
  );
}