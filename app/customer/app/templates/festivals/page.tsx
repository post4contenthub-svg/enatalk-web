"use client";

import { useState } from "react";

type Festival = {
  key: string;
  name: string;
  date: string;
};

const FESTIVALS: Festival[] = [
  // 🎉 Universal
  { key: "new_year", name: "New Year 🎉", date: "Jan 1" },
  { key: "christmas", name: "Christmas 🎄", date: "Dec 25" },

  // 🇮🇳 National Days
  { key: "republic_day", name: "Republic Day 🇮🇳", date: "Jan 26" },
  { key: "independence_day", name: "Independence Day 🇮🇳", date: "Aug 15" },
  { key: "gandhi_jayanti", name: "Gandhi Jayanti 🇮🇳", date: "Oct 2" },

  // 👩‍👧 Social / Awareness
  { key: "womens_day", name: "Women’s Day 👩", date: "Mar 8" },
  { key: "labour_day", name: "Labour Day 👷", date: "May 1" },
  { key: "teachers_day", name: "Teacher’s Day 📚", date: "Sep 5" },
  { key: "childrens_day", name: "Children’s Day 🧒", date: "Nov 14" },

  // 🏢 Business / Relationship
  { key: "financial_year", name: "New Financial Year 💼", date: "Apr 1" },
  {
    key: "customer_anniversary",
    name: "Customer Anniversary 🎉",
    date: "Based on customer date",
  },
];

export default function FestivalsPage() {
  const [active, setActive] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, string>>({});

  const toggleActive = (key: string) => {
    setActive((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getDefaultMessage = (name: string) =>
    `Hi {{name}},\n\nWishing you a very happy ${name}! 🎉\n\n– {{business_name}}`;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Festivals & Special Days 🎉
        </h1>
        <p className="text-sm text-slate-400">
          Activate once. Messages will be sent automatically every year.
        </p>
      </div>

      {/* Festival List */}
      <div className="space-y-4">
        {FESTIVALS.map((festival) => {
          const isActive = active[festival.key];
          const isEditing = editing === festival.key;

          return (
            <div
              key={festival.key}
              className="rounded-lg bg-slate-800 border border-slate-700 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">
                    {festival.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {festival.date}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setEditing(isEditing ? null : festival.key);
                      setMessages((prev) => ({
                        ...prev,
                        [festival.key]:
                          prev[festival.key] ||
                          getDefaultMessage(festival.name),
                      }));
                    }}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Edit Message
                  </button>

                  <button
                    onClick={() => toggleActive(festival.key)}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      isActive
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {isActive ? "ON" : "OFF"}
                  </button>
                </div>
              </div>

              {isEditing && (
                <div className="mt-4 space-y-2">
                  <textarea
                    rows={4}
                    value={messages[festival.key]}
                    onChange={(e) =>
                      setMessages({
                        ...messages,
                        [festival.key]: e.target.value,
                      })
                    }
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 p-3 text-sm text-white"
                  />

                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-400">
                      You can use variables like{" "}
                      <span className="text-slate-200">
                        {'{{name}}'}
                      </span>
                    </p>

                    <button
                      onClick={() => setEditing(null)}
                      className="text-sm text-emerald-400 hover:text-emerald-300"
                    >
                      Save Message
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-lg bg-slate-900 p-4 text-xs text-slate-400">
        ⚠ These messages will be sent automatically on the selected date every
        year. Before going live, ensure your WhatsApp templates are approved.
      </div>
    </div>
  );
}
