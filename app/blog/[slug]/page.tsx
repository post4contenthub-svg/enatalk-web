// app/blog/[slug]/page.tsx — Individual blog post page
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// ── Blog post content ──────────────────────────────────────────
const posts: Record<string, {
  title: string; excerpt: string; category: string;
  readTime: string; date: string; emoji: string;
  content: string;
}> = {
  "bulk-whatsapp-messages-legally-india": {
    title: "How to Send Bulk WhatsApp Messages Legally in India (2026)",
    excerpt: "The complete guide to sending bulk WhatsApp messages using the official Business API — without getting banned.",
    category: "Guide", readTime: "8 min read", date: "May 1, 2026", emoji: "📱",
    content: `
## What is "bulk WhatsApp messaging" — and why most businesses do it wrong

Every day, thousands of Indian business owners try to send promotional messages to hundreds of contacts using the regular WhatsApp app or unofficial tools. Most of them get their numbers banned within weeks.

The right way is through the **official WhatsApp Business Cloud API by Meta** — which is exactly what EnaTalk uses.

## The 3 rules you must follow

**1. Get explicit opt-in consent**

Before you send any marketing message, your customer must have agreed to receive messages from your business. This can be as simple as:
- A checkbox on your website: "Send me offers on WhatsApp"
- A physical form at your shop
- A WhatsApp message where they say "Yes, send me updates"

**2. Use approved message templates**

For the first message to any customer, you must use a **pre-approved template**. These are message formats submitted to Meta for review. Once approved, you can send them to any opted-in contact.

Examples of approved templates:
- "Hi {{name}}, your appointment at {{business}} is confirmed for {{date}}."
- "Happy Birthday {{name}}! Here's a special offer just for you: {{offer}}"

**3. Never use unofficial tools**

Tools that claim to send bulk WhatsApp without the API (browser extensions, modified WhatsApp, etc.) violate Meta's Terms of Service. Using them risks permanent ban of your number.

## How EnaTalk makes this easy

EnaTalk handles all of this for you:
- ✅ Opt-in management built in
- ✅ Template submission to Meta
- ✅ Compliant campaign sending
- ✅ Official Meta API — zero ban risk

## Getting started

1. Sign up at [app.enatalk.com](https://app.enatalk.com) — free plan available
2. Connect your WhatsApp Business number (takes 5 minutes)
3. Create your first template
4. Import your contacts (CSV upload or manual add)
5. Send your first campaign

The entire process takes under 30 minutes for most businesses.

## Frequently asked questions

**How many messages can I send per day?**
On the free plan: 500/month. On paid plans starting at ₹299/month: up to unlimited.

**What happens if a customer replies?**
All replies come to your EnaTalk inbox. You can respond directly.

**Is this legal in India?**
Yes — completely legal when you follow the opt-in rules and use approved templates.
    `,
  },
  "wati-vs-aisensy-vs-enatalk": {
    title: "Wati vs AiSensy vs EnaTalk — Honest Comparison 2026",
    excerpt: "We compared pricing, features, and ease of use across the top WhatsApp automation platforms in India.",
    category: "Comparison", readTime: "6 min read", date: "Apr 28, 2026", emoji: "⚖️",
    content: `
## The WhatsApp automation market in India

Three platforms dominate WhatsApp automation for Indian businesses: Wati, AiSensy, and EnaTalk. They all use the official WhatsApp Business Cloud API — but they differ significantly in price, features, and who they're built for.

## Pricing comparison

| Platform | Starting price | Messages included |
|---|---|---|
| Wati | ₹2,399/month | 1,000 conversations |
| AiSensy | ₹999/month | Limited |
| **EnaTalk** | **₹0 (free plan)** | **500 messages** |
| EnaTalk Starter | ₹299/month | 3,000 messages |

EnaTalk is 83% cheaper than Wati and 70% cheaper than AiSensy at equivalent features.

## Feature comparison

**Mobile-first design**
- Wati: Desktop-focused, complex UI
- AiSensy: Partially mobile
- EnaTalk: Built for phones — works completely from your smartphone

**Setup time**
- Wati: 1-2 days (complex onboarding)
- AiSensy: Few hours
- EnaTalk: 5 minutes

**Hindi & regional languages**
- Wati: English only templates
- AiSensy: Limited
- EnaTalk: Hindi, Bengali, Tamil, Gujarati built-in

**Birthday automation**
- Wati: Available on higher plans
- AiSensy: Basic
- EnaTalk: Included from Starter plan (₹299)

## Who should use each platform?

**Wati** — Large enterprises with dedicated IT teams and ₹2,000+ monthly budget. Good for complex chatbots and CRM integrations.

**AiSensy** — Mid-sized businesses with ₹1,000+ budget who want a balance of features and price.

**EnaTalk** — Small and medium Indian businesses — salons, restaurants, shops, coaching centres — who want to get started quickly at low cost.

## Our verdict

If you're a small business owner in India wanting to send WhatsApp campaigns, birthday wishes, and festival offers — **EnaTalk is the clear choice**. You get 80% of what Wati offers at 15% of the price.

[Start free on EnaTalk →](https://app.enatalk.com)
    `,
  },
  "whatsapp-birthday-automation": {
    title: "How to Automate Birthday Wishes on WhatsApp for Your Business",
    excerpt: "Birthday messages have 5x higher open rates than regular campaigns. Here's how to set them up.",
    category: "Tutorial", readTime: "5 min read", date: "Apr 25, 2026", emoji: "🎂",
    content: `
## Why birthday messages work so well

Birthday messages from businesses have a **98% open rate** — compared to 20% for regular email and 60% for regular WhatsApp campaigns.

Why? Because everyone checks a birthday message. It feels personal. And if there's a discount attached — they use it.

## What results to expect

Businesses using birthday automation with EnaTalk typically see:
- 40-60% of birthday message recipients visit within 2 weeks
- 25% higher average spend on birthday visit
- Significant increase in customer loyalty

## Setting up birthday automation on EnaTalk

**Step 1 — Collect birthdays**

When adding contacts, include their birthday. You can:
- Ask directly when they visit
- Add a birthday field to your contact form
- Import from existing spreadsheet via CSV

**Step 2 — Create your birthday template**

Example templates:

*For salons:*
"🎂 Happy Birthday {{name}}! To celebrate your special day, we're giving you 20% off any service this week. Book now: {{booking_link}} — Team {{business_name}}"

*For restaurants:*
"🎉 Happy Birthday {{name}}! Come celebrate with us and get a complimentary dessert on us today. Show this message when you arrive. — {{restaurant_name}}"

*For jewellery shops:*
"💍 Wishing you a sparkling birthday {{name}}! Enjoy special birthday pricing this week — visit us or reply to know more. — {{shop_name}}"

**Step 3 — Enable automation**

In EnaTalk dashboard:
1. Go to Automations
2. Select Birthday Automation
3. Choose your template
4. Set timing (day before, day of, or both)
5. Enable

That's it. EnaTalk sends automatically every year.

## Pro tips

- Send the night before at 8pm — they'll see it first thing on their birthday
- Include a time-limited offer (expires in 48 hours) to create urgency
- Personalise with their name — template variables make this automatic
    `,
  },
};

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = posts[params.slug];
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.title} | EnaTalk Blog`,
    description: post.excerpt,
  };
}

export function generateStaticParams() {
  return Object.keys(posts).map(slug => ({ slug }));
}

function renderContent(content: string) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let tableRows: string[][] = [];
  let inTable = false;

  while (i < lines.length) {
    const line = lines[i];

    // Table
    if (line.startsWith("|")) {
      if (!inTable) { inTable = true; tableRows = []; }
      if (!line.includes("---")) tableRows.push(line.split("|").filter(c => c.trim()).map(c => c.trim()));
      i++; continue;
    } else if (inTable) {
      inTable = false;
      elements.push(
        <div key={`table-${i}`} style={{ overflowX: "auto", marginBottom: 28 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr>{tableRows[0]?.map((h, j) => <th key={j} style={{ padding: "10px 16px", textAlign: "left", background: "rgba(34,197,94,0.08)", color: "#22C55E", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {tableRows.slice(1).map((row, ri) => (
                <tr key={ri}>{row.map((cell, ci) => <td key={ci} style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", color: ci === 0 ? "#fff" : "rgba(255,255,255,0.6)", fontWeight: ci === 0 ? 600 : 400 }}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (line.startsWith("## ")) {
      elements.push(<h2 key={i} style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: "-0.5px", color: "#fff", marginBottom: 14, marginTop: 36, paddingTop: 36, borderTop: "1px solid rgba(255,255,255,0.06)" }}>{line.slice(3)}</h2>);
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(<p key={i} style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 8 }}>{line.slice(2,-2)}</p>);
    } else if (line.startsWith("- ")) {
      elements.push(<li key={i} style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, paddingLeft: 8, marginBottom: 4 }}>{line.slice(2).replace(/\*\*(.*?)\*\*/g, "$1")}</li>);
    } else if (line.match(/^\d+\. /)) {
      elements.push(<li key={i} style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, paddingLeft: 8, marginBottom: 6, listStyleType: "decimal" }}>{line.replace(/^\d+\. /, "")}</li>);
    } else if (line.startsWith("*")) {
      elements.push(<p key={i} style={{ fontSize: 14, fontStyle: "italic", color: "rgba(255,255,255,0.55)", background: "rgba(255,255,255,0.03)", borderLeft: "3px solid rgba(34,197,94,0.4)", padding: "12px 16px", borderRadius: "0 10px 10px 0", marginBottom: 16, lineHeight: 1.7 }}>{line.slice(1).trim()}</p>);
    } else if (line.trim() === "") {
      elements.push(<div key={i} style={{ height: 8 }}/>);
    } else if (line.trim()) {
      const parsed = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" style="color:#22C55E;font-weight:600;">$1</a>`).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      elements.push(<p key={i} style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.85, marginBottom: 14 }} dangerouslySetInnerHTML={{ __html: parsed }}/>);
    }
    i++;
  }
  return elements;
}

export default function BlogPostPage({ params }: Props) {
  const post = posts[params.slug];
  if (!post) notFound();

  const catColors: Record<string, { bg: string; color: string }> = {
    Guide:      { bg: "rgba(34,197,94,0.12)",   color: "#22C55E" },
    Tutorial:   { bg: "rgba(59,130,246,0.12)",  color: "#60A5FA" },
    Comparison: { bg: "rgba(245,184,0,0.12)",   color: "#F5B800" },
    Industry:   { bg: "rgba(167,139,250,0.12)", color: "#A78BFA" },
    Education:  { bg: "rgba(251,146,60,0.12)",  color: "#FB923C" },
    Templates:  { bg: "rgba(52,211,153,0.12)",  color: "#34D399" },
  };
  const cc = catColors[post.category] ?? catColors.Guide;

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#040B1C", color: "#fff", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Bricolage+Grotesque:wght@700;800&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;} a{text-decoration:none;color:inherit;} ul,ol{padding-left:20px;margin-bottom:20px;}`}</style>

      {/* Nav */}
      <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/">
            <img src="/enatalk-logo.webp" alt="EnaTalk" style={{ height: 36, width: "auto", filter: "drop-shadow(0 0 8px rgba(245,184,0,0.4))" }}/>
          </Link>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <Link href="/blog" style={{ fontSize: 14, color: "#22C55E", fontWeight: 600 }}>← Blog</Link>
            <Link href="https://app.enatalk.com" style={{ fontSize: 14, fontWeight: 700, padding: "8px 20px", background: "linear-gradient(135deg,#22C55E,#16A34A)", borderRadius: 10, color: "#fff" }}>Start Free →</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 740, margin: "0 auto", padding: "56px 24px 80px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 32 }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.35)" }}>Home</Link>
          <span>/</span>
          <Link href="/blog" style={{ color: "rgba(255,255,255,0.35)" }}>Blog</Link>
          <span>/</span>
          <span style={{ color: "rgba(255,255,255,0.55)" }}>{post.category}</span>
        </div>

        {/* Post header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 52, marginBottom: 20 }}>{post.emoji}</div>
          <span style={{ fontSize: 11, fontWeight: 700, background: cc.bg, color: cc.color, padding: "4px 12px", borderRadius: 100, marginBottom: 16, display: "inline-block" }}>{post.category}</span>
          <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: "clamp(26px,4vw,40px)", letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 20, color: "#fff" }}>{post.title}</h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, marginBottom: 24 }}>{post.excerpt}</p>
          <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 13, color: "rgba(255,255,255,0.35)", paddingBottom: 28, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#22C55E,#16A34A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>E</div>
            <span style={{ color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>EnaTalk Team</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Post content */}
        <div>{renderContent(post.content)}</div>

        {/* CTA */}
        <div style={{ marginTop: 56, background: "linear-gradient(135deg,rgba(34,197,94,0.08),rgba(34,197,94,0.03))", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 20, padding: "36px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 14 }}>🚀</div>
          <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: "-0.5px", marginBottom: 12 }}>Ready to get started?</h3>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", marginBottom: 24, lineHeight: 1.7 }}>Join 1,000+ Indian businesses using EnaTalk. Free plan available — no credit card needed.</p>
          <Link href="https://app.enatalk.com" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: "linear-gradient(135deg,#22C55E,#16A34A)", color: "#fff", borderRadius: 12, fontSize: 15, fontWeight: 700, boxShadow: "0 6px 20px rgba(34,197,94,0.3)" }}>
            Start Free on EnaTalk →
          </Link>
        </div>

        {/* Back to blog */}
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <Link href="/blog" style={{ fontSize: 14, color: "#22C55E", fontWeight: 600 }}>← Back to all articles</Link>
        </div>
      </div>
    </div>
  );
}
