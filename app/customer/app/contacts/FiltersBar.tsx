"use client";

type FiltersBarProps = {
  onSearchChange: (value: string) => void;
};

export default function FiltersBar({ onSearchChange }: FiltersBarProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Search */}
      <input
        type="text"
        placeholder="Search contacts..."
        className="px-3 py-2 border rounded text-sm w-64"
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}