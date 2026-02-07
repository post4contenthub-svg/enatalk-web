"use client";

import { useState } from "react";

const HELP_SECTIONS = [
  {
    category: "Getting Started",
    title: "How do I get started?",
    content: [
      "Create or import your contacts",
      "Connect a new WhatsApp number",
      "Select a message template",
      "Start campaigns or automations",
    ],
  },
  {
    category: "WhatsApp Connection",
    title: "Connecting WhatsApp",
    content: [
      "EnaTalk uses WhatsApp’s official Cloud API",
      "You do not need WhatsApp or WhatsApp Business app",
      "Use a new or unused mobile number",
      "OTP verification will be required",
      "Campaigns and templates unlock after connection",
    ],
  },
  {
    category: "FAQ",
    title: "Do I need WhatsApp Business App?",
    content: ["No. EnaTalk works without any WhatsApp app."],
  },
  {
    category: "FAQ",
    title: "Can I use my personal WhatsApp number?",
    content: [
      "Only if the number is not already used on WhatsApp",
      "We recommend using a new number",
    ],
  },
  {
    category: "FAQ",
    title: "Is this official WhatsApp?",
    content: ["Yes. EnaTalk uses Meta’s official WhatsApp Cloud API."],
  },
  {
    category: "FAQ",
    title: "Who pays WhatsApp message charges?",
    content: ["WhatsApp conversation charges are billed by Meta."],
  },
  {
    category: "FAQ",
    title: "Can I change my WhatsApp number later?",
    content: ["Yes. You can disconnect and connect a new number anytime."],
  },
];

export default function HelpPage() {
  const [query, setQuery] = useState("");

  const filteredSections = HELP_SECTIONS.filter((section) => {
    const q = query.toLowerCase();
    return (
      section.title.toLowerCase().includes(q) ||
      section.category.toLowerCase().includes(q) ||
      section.content.some((line) => line.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-5xl">

      {/* Header with search */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Help & Support
          </h1>
          <p className="text-sm text-slate-400">
            Everything you need to get started with EnaTalk
          </p>
        </div>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search help..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-64 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Contact Support */}
      <div className="mb-8 rounded-lg bg-slate-900 p-5 flex items-center justify-between">
        <div>
          <h3 className="font-medium text-white">Need quick help?</h3>
          <p className="text-sm text-slate-400">
            Chat with EnaTalk support on WhatsApp
          </p>
        </div>

        <a
          href="https://wa.me/919999999999?text=Hi%20EnaTalk%20Support"
          target="_blank"
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          Contact Support on WhatsApp
        </a>
      </div>

      {/* Video Tutorials */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-4">
          Video Tutorials
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "How to connect WhatsApp",
            "How to import contacts",
            "How to create a campaign",
            "How automations work",
          ].map((title) => (
            <div
              key={title}
              className="rounded-lg bg-slate-900 p-4 border border-slate-700"
            >
              <div className="h-32 flex items-center justify-center rounded bg-slate-800 text-slate-500 text-sm">
                ▶ Video coming soon
              </div>
              <p className="mt-3 text-sm text-slate-300">{title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Help content */}
      <div className="space-y-6">
        {filteredSections.length === 0 && (
          <p className="text-sm text-slate-400">
            No results found. Try a different keyword.
          </p>
        )}

        {filteredSections.map((section, index) => (
          <div
            key={index}
            className="rounded-lg bg-slate-900 p-5"
          >
            <p className="text-xs uppercase text-slate-500 mb-1">
              {section.category}
            </p>
            <h3 className="font-medium text-white">
              {section.title}
            </h3>
            <ul className="mt-2 list-disc list-inside text-sm text-slate-400 space-y-1">
              {section.content.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Compliance */}
      <div className="mt-10 rounded-lg bg-slate-900 p-4 text-xs text-slate-400">
        EnaTalk uses WhatsApp’s official Cloud API. Sending unsolicited or spam
        messages may result in account restrictions.
      </div>
    </div>
  );
}
