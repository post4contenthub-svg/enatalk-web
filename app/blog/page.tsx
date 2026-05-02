// app/blog/page.tsx — Blog listing page
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — WhatsApp Marketing Tips & Guides | EnaTalk",
  description: "Learn how to grow your business with WhatsApp automation. Tips, guides and case studies for Indian businesses.",
};

const posts = [
  {
    slug: "bulk-whatsapp-messages-legally-india",
    title: "How to Send Bulk WhatsApp Messages Legally in India (2026)",
    excerpt: "The complete guide to sending bulk WhatsApp messages using the official Business API — without getting banned. Covers opt-in rules, templates, and best practices.",
    category: "Guide",
    readTime: "8 min read",
    date: "May 1, 2026",
    emoji: "📱",
    featured: true,
  },
  {
    slug: "wati-vs-aisensy-vs-enatalk",
    title: "Wati vs AiSensy vs EnaTalk — Honest Comparison 2026",
    excerpt: "We compared pricing, features, and ease of use across the top WhatsApp automation platforms in India. Here's what we found.",
    category: "Comparison",
    readTime: "6 min read",
    date: "Apr 28, 2026",
    emoji: "⚖️",
    featured: true,
  },
  {
    slug: "whatsapp-birthday-automation",
    title: "How to Automate Birthday Wishes on WhatsApp for Your Business",
    excerpt: "Birthday messages have 5x higher open rates than regular campaigns. Here's how to set up automated birthday wishes that feel personal.",
    category: "Tutorial",
    readTime: "5 min read",
    date: "Apr 25, 2026",
    emoji: "🎂",
    featured: false,
  },
  {
    slug: "whatsapp-festival-offers-india",
    title: "How to Send Diwali, Eid & Christmas Offers on WhatsApp",
    excerpt: "Festival campaigns drive 3x more footfall than regular promotions. Learn how to plan and send festival offers that customers actually open.",
    category: "Guide",
    readTime: "6 min read",
    date: "Apr 22, 2026",
    emoji: "🪔",
    featured: false,
  },
  {
    slug: "whatsapp-marketing-salons-india",
    title: "WhatsApp Marketing for Salons — The Complete 2026 Guide",
    excerpt: "How salon owners across India are using WhatsApp to fill appointment slots, reduce no-shows, and keep customers coming back.",
    category: "Industry",
    readTime: "7 min read",
    date: "Apr 20, 2026",
    emoji: "💇",
    featured: false,
  },
  {
    slug: "whatsapp-business-api-vs-app",
    title: "WhatsApp Business API vs WhatsApp Business App — What's the Difference?",
    excerpt: "Most business owners don't know the difference. One lets you send to 5 people. The other lets you reach 10,000. Here's a plain-English explanation.",
    category: "Education",
    readTime: "4 min read",
    date: "Apr 18, 2026",
    emoji: "📚",
    featured: false,
  },
  {
    slug: "whatsapp-message-templates-india",
    title: "50 WhatsApp Message Templates for Indian Businesses (Free)",
    excerpt: "Ready-to-use WhatsApp templates for salons, restaurants, jewellery shops, travel agencies and more. Copy, paste, and customise.",
    category: "Templates",
    readTime: "10 min read",
    date: "Apr 15, 2026",
    emoji: "📋",
    featured: false,
  },
  {
    slug: "whatsapp-restaurant-marketing",
    title: "How Indian Restaurants Use WhatsApp to Fill Tables Every Day",
    excerpt: "Daily specials, reservation reminders, loyalty offers — how restaurants across India are using WhatsApp to drive consistent footfall.",
    category: "Industry",
    readTime: "6 min read",
    date: "Apr 12, 2026",
    emoji: "☕",
    featured: false,
  },
];

const categories = ["All", "Guide", "Tutorial", "Comparison", "Industry", "Education", "Templates"];

const catColors: Record<string, { bg: string; color: string }> = {
  Guide:      { bg: "rgba(34,197,94,0.12)",   color: "#22C55E" },
  Tutorial:   { bg: "rgba(59,130,246,0.12)",  color: "#60A5FA" },
  Comparison: { bg: "rgba(245,184,0,0.12)",   color: "#F5B800" },
  Industry:   { bg: "rgba(167,139,250,0.12)", color: "#A78BFA" },
  Education:  { bg: "rgba(251,146,60,0.12)",  color: "#FB923C" },
  Templates:  { bg: "rgba(52,211,153,0.12)",  color: "#34D399" },
};

export default function BlogPage() {
  const featured = posts.filter(p => p.featured);
  const rest = posts.filter(p => !p.featured);

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#040B1C", color: "#fff", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Bricolage+Grotesque:wght@700;800&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        a{text-decoration:none;color:inherit;}
        .post-card:hover{border-color:rgba(34,197,94,0.3)!important;transform:translateY(-3px);}
        .post-card{transition:all .25s;}
        .cat-pill:hover{opacity:0.8;}
      `}</style>

      {/* Nav */}
      <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/enatalk-logo.webp" alt="EnaTalk" style={{ height: 36, width: "auto", filter: "drop-shadow(0 0 8px rgba(245,184,0,0.4))" }}/>
          </Link>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <Link href="/#pricing" style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>Pricing</Link>
            <Link href="/blog" style={{ fontSize: 14, color: "#22C55E", fontWeight: 600 }}>Blog</Link>
            <Link href="https://app.enatalk.com" style={{ fontSize: 14, fontWeight: 700, padding: "8px 20px", background: "linear-gradient(135deg,#22C55E,#16A34A)", borderRadius: 10, color: "#fff", boxShadow: "0 4px 14px rgba(34,197,94,0.3)" }}>Start Free →</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.10)", color: "#22C55E", border: "1px solid rgba(34,197,94,0.22)", borderRadius: 100, padding: "5px 16px", fontSize: 12, fontWeight: 600, marginBottom: 20 }}>
            📝 EnaTalk Blog
          </span>
          <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: "clamp(32px,5vw,54px)", letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: 18 }}>
            WhatsApp Marketing<br/>
            <span style={{ background: "linear-gradient(135deg,#22C55E,#34D399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Tips & Guides</span>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", maxWidth: 520, margin: "0 auto", lineHeight: 1.8 }}>
            Practical guides for Indian businesses to grow with WhatsApp automation — no jargon, no fluff.
          </p>
        </div>

        {/* Category filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 52 }}>
          {categories.map(c => (
            <Link key={c} href={c === "All" ? "/blog" : `/blog/category/${c.toLowerCase()}`} className="cat-pill" style={{ padding: "7px 18px", borderRadius: 100, fontSize: 13, fontWeight: 600, background: c === "All" ? "linear-gradient(135deg,#22C55E,#16A34A)" : "rgba(255,255,255,0.05)", color: c === "All" ? "#fff" : "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer" }}>
              {c}
            </Link>
          ))}
        </div>

        {/* Featured posts */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(460px,1fr))", gap: 20, marginBottom: 20 }}>
          {featured.map(post => {
            const cc = catColors[post.category] ?? catColors.Guide;
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="post-card" style={{ display: "block", background: "linear-gradient(160deg,rgba(34,197,94,0.06),rgba(34,197,94,0.02))", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 24, padding: "32px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 20, right: 20, fontSize: 10, fontWeight: 800, background: "rgba(34,197,94,0.15)", color: "#22C55E", padding: "4px 10px", borderRadius: 100, letterSpacing: "0.06em" }}>✦ FEATURED</div>
                <div style={{ fontSize: 40, marginBottom: 20 }}>{post.emoji}</div>
                <span style={{ fontSize: 11, fontWeight: 700, background: cc.bg, color: cc.color, padding: "3px 10px", borderRadius: 100, marginBottom: 14, display: "inline-block" }}>{post.category}</span>
                <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: "-0.5px", lineHeight: 1.3, marginBottom: 12, color: "#fff" }}>{post.title}</h2>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.75, marginBottom: 20 }}>{post.excerpt}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                  <span style={{ marginLeft: "auto", color: "#22C55E", fontWeight: 600, fontSize: 13 }}>Read →</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* All posts grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
          {rest.map(post => {
            const cc = catColors[post.category] ?? catColors.Guide;
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="post-card" style={{ display: "block", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{post.emoji}</div>
                  <span style={{ fontSize: 11, fontWeight: 700, background: cc.bg, color: cc.color, padding: "3px 10px", borderRadius: 100, marginTop: 4, display: "inline-block" }}>{post.category}</span>
                </div>
                <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: "-0.3px", lineHeight: 1.4, marginBottom: 10, color: "#fff" }}>{post.title}</h2>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: 16 }}>{post.excerpt}</p>
                <div style={{ display: "flex", alignItems: "center", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
                  <span>{post.date}</span>
                  <span style={{ margin: "0 8px" }}>·</span>
                  <span>{post.readTime}</span>
                  <span style={{ marginLeft: "auto", color: "#22C55E", fontWeight: 600, fontSize: 12 }}>Read →</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 72, background: "linear-gradient(135deg,rgba(34,197,94,0.08),rgba(34,197,94,0.03))", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 24, padding: "48px 40px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 32, letterSpacing: "-1px", marginBottom: 14 }}>
            Ready to automate your WhatsApp?
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", marginBottom: 28, maxWidth: 440, margin: "0 auto 28px" }}>
            Join 1,000+ Indian businesses using EnaTalk to send campaigns, birthday wishes and festival offers.
          </p>
          <Link href="https://app.enatalk.com" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", background: "linear-gradient(135deg,#22C55E,#16A34A)", color: "#fff", borderRadius: 14, fontSize: 16, fontWeight: 700, boxShadow: "0 8px 24px rgba(34,197,94,0.35)" }}>
            🚀 Start Free — No Credit Card
          </Link>
        </div>

      </div>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
          © {new Date().getFullYear()} EnaTalk · <Link href="/" style={{ color: "rgba(255,255,255,0.3)" }}>Home</Link> · <Link href="/blog" style={{ color: "#22C55E" }}>Blog</Link> · <Link href="/#pricing" style={{ color: "rgba(255,255,255,0.3)" }}>Pricing</Link>
        </p>
      </footer>
    </div>
  );
}
