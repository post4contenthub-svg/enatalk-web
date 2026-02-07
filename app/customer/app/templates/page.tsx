"use client";

import { useRouter } from "next/navigation";

const TEMPLATE_CATEGORIES = [
  { slug: "birthday", name: "Birthday", emoji: "🎂" },
  { slug: "anniversary", name: "Anniversary", emoji: "💍" },
  { slug: "promotion", name: "Promotion", emoji: "📢" },
  { slug: "reminder", name: "Reminder", emoji: "🔔" },
  { slug: "feedback", name: "Feedback", emoji: "⭐" },
  { slug: "welcome", name: "Welcome", emoji: "👋" },
  { slug: "order-update", name: "Order / Service Update", emoji: "📦" },
  { slug: "thank-you", name: "Thank You", emoji: "🙏" },
  { slug: "follow-up", name: "Follow-up", emoji: "⏰" },

  // 🎉 NEW CATEGORY
  {
    slug: "festivals",
    name: "Festivals & Special Days",
    emoji: "🎉",
  },

  // 🔒 Custom (Pro later)
  {
    slug: "custom",
    name: "Custom",
    emoji: "✨",
    locked: true,
  },
];

export default function TemplatesPage() {
  const router = useRouter();

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Templates</h1>
        <p className="text-sm text-slate-400">
          Choose a category to manage message templates
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {TEMPLATE_CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            onClick={() =>
              router.push(`/customer/app/templates/${cat.slug}`)
            }
            className="
              flex items-center justify-between rounded-lg p-4
              bg-slate-800 hover:bg-slate-700 border border-slate-700
              text-white text-left
            "
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{cat.emoji}</span>
              <span className="font-medium">{cat.name}</span>
            </div>

            {cat.locked && (
              <span className="text-xs text-yellow-400">🔒 Pro</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
