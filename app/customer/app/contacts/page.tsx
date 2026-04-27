"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import ContactsClient from "./ContactsClient";
import ContactsFilterBar from "./ContactsFilterBar";
import ContactsSearchBar from "./ContactsSearchBar";
import NewContactButton from "./NewContactButton";
import ImportCsvButton from "./ImportCsvButton";

// ── Types ──────────────────────────────────────────────────────────────────
export type Contact = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tags?: string[];
  opted_in: boolean;
  created_at: string;
  last_contacted_at?: string;
  notes?: string;
  group?: string;
};

export type FilterState = {
  optIn: "all" | "opted_in" | "opted_out";
  tag: string;
  group: string;
  sortBy: "name" | "created_at" | "last_contacted_at";
  sortDir: "asc" | "desc";
};

// ── Page ───────────────────────────────────────────────────────────────────
export default function ContactsPage() {
  const supabase = createClient();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filtered, setFiltered] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterState>({
    optIn: "all",
    tag: "",
    group: "",
    sortBy: "created_at",
    sortDir: "desc",
  });
  const [stats, setStats] = useState({ total: 0, opted_in: 0, opted_out: 0, new_this_month: 0 });

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchContacts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setContacts(data);
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      setStats({
        total: data.length,
        opted_in: data.filter((c: Contact) => c.opted_in).length,
        opted_out: data.filter((c: Contact) => !c.opted_in).length,
        new_this_month: data.filter((c: Contact) => c.created_at >= monthStart).length,
      });
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  // ── Filter + Search ──────────────────────────────────────────────────────
  useEffect(() => {
    let result = [...contacts];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.name?.toLowerCase().includes(q) ||
        c.phone?.includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    if (filters.optIn === "opted_in") result = result.filter(c => c.opted_in);
    if (filters.optIn === "opted_out") result = result.filter(c => !c.opted_in);
    if (filters.tag) result = result.filter(c => c.tags?.includes(filters.tag));
    if (filters.group) result = result.filter(c => c.group === filters.group);

    result.sort((a, b) => {
      const av = (a[filters.sortBy] ?? "") as string;
      const bv = (b[filters.sortBy] ?? "") as string;
      return filters.sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });

    setFiltered(result);
    setSelected(new Set());
  }, [contacts, search, filters]);

  // ── Bulk delete ──────────────────────────────────────────────────────────
  const handleBulkDelete = async () => {
    if (!selected.size) return;
    if (!confirm(`Delete ${selected.size} contact(s)? This cannot be undone.`)) return;
    await supabase.from("contacts").delete().in("id", Array.from(selected));
    await fetchContacts();
  };

  // ── Bulk opt-out ─────────────────────────────────────────────────────────
  const handleBulkOptOut = async () => {
    if (!selected.size) return;
    await supabase.from("contacts").update({ opted_in: false }).in("id", Array.from(selected));
    await fetchContacts();
  };

  // ── All tags & groups for filter dropdowns ───────────────────────────────
  const allTags = Array.from(new Set(contacts.flatMap(c => c.tags ?? [])));
  const allGroups = Array.from(new Set(contacts.map(c => c.group).filter(Boolean))) as string[];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#040B1C", color: "#fff", padding: "0 0 80px" }}>
      <style>{`
        *{box-sizing:border-box;}
        ::selection{background:rgba(34,197,94,0.3);}
        .stat-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:20px 24px;transition:border-color .2s;}
        .stat-card:hover{border-color:rgba(34,197,94,0.2);}
        .btn-primary{background:linear-gradient(135deg,#22C55E,#16A34A);color:#fff;border:none;border-radius:10px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:"DM Sans",sans-serif;display:flex;align-items:center;gap:6px;white-space:nowrap;box-shadow:0 4px 14px rgba(34,197,94,0.3);transition:opacity .2s;}
        .btn-primary:hover{opacity:0.88;}
        .btn-ghost{background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:9px 16px;font-size:13px;font-weight:600;cursor:pointer;font-family:"DM Sans",sans-serif;display:flex;align-items:center;gap:6px;white-space:nowrap;transition:all .2s;}
        .btn-ghost:hover{background:rgba(255,255,255,0.09);border-color:rgba(255,255,255,0.18);}
        .btn-danger{background:rgba(239,68,68,0.1);color:#f87171;border:1px solid rgba(239,68,68,0.25);border-radius:10px;padding:9px 16px;font-size:13px;font-weight:600;cursor:pointer;font-family:"DM Sans",sans-serif;display:flex;align-items:center;gap:6px;white-space:nowrap;transition:all .2s;}
        .btn-danger:hover{background:rgba(239,68,68,0.18);}
        @media(max-width:768px){.stats-grid{grid-template-columns:1fr 1fr!important;}.toolbar{flex-wrap:wrap!important;}.bulk-bar{flex-wrap:wrap!important;}}
      `}</style>

      {/* ── Page Header ── */}
      <div style={{ padding: "32px 32px 0", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: "clamp(22px,3vw,30px)", letterSpacing: "-0.8px", color: "#fff", marginBottom: 6 }}>
              Contacts
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", margin: 0 }}>
              Manage your WhatsApp contact list, opt-ins, and groups
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <ImportCsvButton onImported={fetchContacts} />
            <NewContactButton onCreated={fetchContacts} />
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div style={{ padding: "0 32px", marginBottom: 28 }}>
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          {[
            { label: "Total Contacts", value: stats.total, icon: "👥", color: "#22C55E" },
            { label: "Opted In", value: stats.opted_in, icon: "✅", color: "#22C55E" },
            { label: "Opted Out", value: stats.opted_out, icon: "🚫", color: "#f87171" },
            { label: "New This Month", value: stats.new_this_month, icon: "🆕", color: "#F5B800" },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</span>
                <span style={{ fontSize: 16 }}>{s.icon}</span>
              </div>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: "clamp(24px,3vw,32px)", color: s.color, letterSpacing: "-1.5px", lineHeight: 1 }}>
                {loading ? "—" : s.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div style={{ padding: "0 32px", marginBottom: 16 }}>
        <div className="toolbar" style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <ContactsSearchBar value={search} onChange={setSearch} />
          </div>
          <ContactsFilterBar
            filters={filters}
            onChange={setFilters}
            allTags={allTags}
            allGroups={allGroups}
          />
        </div>
      </div>

      {/* ── Bulk Action Bar ── */}
      {selected.size > 0 && (
        <div style={{ padding: "0 32px", marginBottom: 14 }}>
          <div className="bulk-bar" style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: 12, padding: "10px 18px",
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#22C55E" }}>
              {selected.size} selected
            </span>
            <div style={{ flex: 1 }} />
            <button className="btn-ghost" onClick={handleBulkOptOut}>
              <span>🚫</span> Opt Out
            </button>
            <button className="btn-danger" onClick={handleBulkDelete}>
              <span>🗑️</span> Delete
            </button>
            <button className="btn-ghost" onClick={() => setSelected(new Set())}>
              ✕ Clear
            </button>
          </div>
        </div>
      )}

      {/* ── Results count ── */}
      <div style={{ padding: "0 32px", marginBottom: 10 }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>
          {loading ? "Loading..." : `Showing ${filtered.length} of ${contacts.length} contacts`}
          {search && ` for "${search}"`}
        </p>
      </div>

      {/* ── Main Table ── */}
      <div style={{ padding: "0 32px" }}>
        {loading ? (
          <LoadingSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState search={search} onClear={() => { setSearch(""); setFilters(f => ({ ...f, optIn: "all", tag: "", group: "" })); }} />
        ) : (
          <ContactsClient
            contacts={filtered}
            selected={selected}
            onSelectChange={setSelected}
            onRefresh={fetchContacts}
          />
        )}
      </div>
    </div>
  );
}

// ── Loading Skeleton ───────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{ display: "flex", gap: 16, padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center" }}>
          <div style={{ width: 16, height: 16, borderRadius: 4, background: "rgba(255,255,255,0.06)" }} />
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ height: 13, width: `${120 + (i % 3) * 40}px`, borderRadius: 6, background: "rgba(255,255,255,0.06)" }} />
            <div style={{ height: 11, width: "80px", borderRadius: 6, background: "rgba(255,255,255,0.04)" }} />
          </div>
          <div style={{ height: 11, width: "100px", borderRadius: 6, background: "rgba(255,255,255,0.04)" }} />
          <div style={{ height: 22, width: "60px", borderRadius: 100, background: "rgba(255,255,255,0.05)" }} />
        </div>
      ))}
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────
function EmptyState({ search, onClear }: { search: string; onClear: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "72px 40px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{search ? "🔍" : "👥"}</div>
      <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 20, color: "#fff", marginBottom: 8 }}>
        {search ? "No contacts found" : "No contacts yet"}
      </h3>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 24, lineHeight: 1.7 }}>
        {search
          ? `No contacts match "${search}". Try a different search or clear your filters.`
          : "Import a CSV or add your first contact to get started."}
      </p>
      {search && (
        <button
          onClick={onClear}
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
        >
          Clear search & filters
        </button>
      )}
    </div>
  );
}
