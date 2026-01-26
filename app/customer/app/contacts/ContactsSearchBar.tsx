"use client";

export function ContactsSearchBar({
  onSearchChange,
}: {
  onSearchChange: (value: string) => void;
}) {
  return (
    <input
      type="text"
      placeholder="Search contacts…"
      onChange={(e) => onSearchChange(e.target.value)}
      className="border px-3 py-2 rounded w-64"
    />
  );
}