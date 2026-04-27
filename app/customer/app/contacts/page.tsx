"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import ContactsClient from "./ContactsClient";
import { ContactsFiltersBar } from "./ContactsFiltersBar";
import NewContactButton from "./NewContactButton";
import ImportCsvButton from "./ImportCsvButton";

type TemplateRow = { id: string; name?: string | null };
type FieldDef = { key: string; label: string; required?: boolean };

export default function ContactsPage() {
  const supabase = createClient();

  const [tenantId, setTenantId] = useState<string>("");
  const [contacts, setContacts] = useState<any[]>([]);
  const [fieldDefs, setFieldDefs] = useState<FieldDef[]>([]);
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactsError, setContactsError] = useState(false);
  const [fieldDefsError, setFieldDefsError] = useState(false);

  // Filter state — matches ContactsFiltersBar props exactly
  const [tag, setTag] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [fieldKey, setFieldKey] = useState("");
  const [fieldValue, setFieldValue] = useState("");

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    new_this_month: 0,
  });

  // ── Fetch user + data ──────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const uid = user.id;
    setTenantId(uid);

    // Contacts
    const { data: contactData, error: cErr } = await supabase
      .from("contacts")
      .select("*")
      .eq("tenant_id", uid)
      .order("created_at", { ascending: false });

    if (cErr) {
      setContactsError(true);
    } else {
      const rows = contactData ?? [];
      setContacts(rows);
      setContactsError(false);
      const monthStart = new Date(
        new Date().getFullYear(), new Date().getMonth(), 1
      ).toISOString();
      setStats({
        total: rows.length,
        new_this_month: rows.filter((c: any) => c.created_at >= monthStart).length,
      });
    }

    // Field defs
    const { data: fdData, error: fdErr } = await supabase
      .from("contact_field_defs")
      .select("key, label")
      .eq("tenant_id", uid)
      .order("position");

    if (fdErr) setFieldDefsError(true);
    else { setFieldDefs(fdData ?? []); setFieldDefsError(false); }

    // Templates
    const { data: tplData } = await supabase
      .from("message_templates")
      .select("id, name")
      .eq("tenant_id", uid);
    setTemplates(tplData ?? []);

    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Filtered contacts ──────────────────────────────────────────────────
  const filtered = contacts.filter(c => {
    if (tag && !(c.tags ?? []).includes(tag)) return false;
    if (fieldKey && fieldValue &&
      String(c.custom_fields?.[fieldKey] ?? "")
        .toLowerCase()
        .indexOf(fieldValue.toLowerCase()) === -1
    ) return false;
    return true;
  });

  function clearFilters() {
    setTag("");
    setTemplateId("");
    setFieldKey("");
    setFieldValue("");
  }

  if (loading) return <PageShell><LoadingSkeleton /></PageShell>;

  return (
    <PageShell>
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: "clamp(22px,3vw,30px)", letterSpacing: "-0.8px", color: "#fff", marginBottom: 6 }}>
            Contacts
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", margin: 0 }}>
            Manage your WhatsApp contact list and groups
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <ImportCsvButton tenantId={tenantId} fieldDefs={fieldDefs} />
          <NewContactButton tenantId={tenantId} fieldDefs={fieldDefs} />
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 28 }}>
        {[
          { label: "Total Contacts", value: stats.total, icon: "👥", color: "#22C55E" },
          { label: "New This Month", value: stats.new_this_month, icon: "🆕", color: "#F5B800" },
          { label: "Field Types", value: fieldDefs.length, icon: "🏷️", color: "#A78BFA" },
          { label: "Templates", value: templates.length, icon: "📋", color: "#3B8BEB" },
        ].map(s => (
          <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "18px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>{s.label}</span>
              <span style={{ fontSize: 16 }}>{s.icon}</span>
            </div>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 28, color: s.color, letterSpacing: "-1.5px", lineHeight: 1 }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div style={{ marginBottom: 20, padding: "16px 20px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14 }}>
        <ContactsFiltersBar
          availableTemplates={templates}
          customFields={fieldDefs}
          tag={tag}
          templateId={templateId}
          fieldKey={fieldKey}
          fieldValue={fieldValue}
          onChangeTag={setTag}
          onChangeTemplateId={setTemplateId}
          onChangeFieldKey={setFieldKey}
          onChangeFieldValue={setFieldValue}
          onClear={clearFilters}
        />
      </div>

      {/* ── Results count ── */}
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>
        Showing {filtered.length} of {contacts.length} contacts
      </p>

      {/* ── Table ── */}
      {filtered.length === 0 ? (
        <EmptyState onClear={clearFilters} />
      ) : (
        <ContactsClient
          tenantId={tenantId}
          initialRows={filtered}
          fieldDefs={fieldDefs}
          contactsError={contactsError}
          fieldDefsError={fieldDefsError}
        />
      )}
    </PageShell>
  );
}

// ── Shell ──────────────────────────────────────────────────────────────────
function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      minHeight: "100vh",
      background: "#040B1C",
      color: "#fff",
      padding: "32px",
      paddingBottom: 80,
    }}>
      <style>{`*{box-sizing:border-box;}::selection{background:rgba(34,197,94,0.3);}`}</style>
      {children}
    </div>
  );
}

// ── Loading Skeleton ───────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div>
      <div style={{ height: 36, width: 180, borderRadius: 8, background: "rgba(255,255,255,0.06)", marginBottom: 8 }} />
      <div style={{ height: 14, width: 260, borderRadius: 6, background: "rgba(255,255,255,0.04)", marginBottom: 28 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ height: 88, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }} />
        ))}
      </div>
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ display: "flex", gap: 14, padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, gap: 6 }}>
              <div style={{ height: 13, width: 140, borderRadius: 6, background: "rgba(255,255,255,0.06)" }} />
              <div style={{ height: 11, width: 90, borderRadius: 6, background: "rgba(255,255,255,0.04)" }} />
            </div>
            <div style={{ height: 24, width: 80, borderRadius: 100, background: "rgba(255,255,255,0.05)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "72px 40px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
      <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 20, color: "#fff", marginBottom: 8 }}>
        No contacts found
      </h3>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 24, lineHeight: 1.7 }}>
        No contacts match your current filters. Try clearing them or import a CSV.
      </p>
      <button onClick={onClear} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
        Clear filters
      </button>
    </div>
  );
}
