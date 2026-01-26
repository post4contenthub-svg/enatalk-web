import NewContactButton from "./NewContactButton";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { SendWhatsAppButton } from "./SendWhatsAppButton";

const TENANT_ID = "5ddd6091-ba29-4b65-8684-f9da79f28af7"; // same as Overview

type ContactRow = {
  id: string;
  name: string | null;
  phone: string;
  tags: string[] | null;
  is_opted_out: boolean;
  last_message_at: string | null;
  created_at: string;
  custom_fields: Record<string, any> | null;
};

type FieldDef = {
  key: string;
  label: string;
  show_in_table: boolean;
  sort_order: number;
};

function formatDate(d: string | null): string {
  if (!d) return "-";
  const date = new Date(d);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ContactsPage() {
  // 1) Load contacts
  const { data: contacts, error } = await supabaseAdmin
    .from("contacts")
    .select(
      "id, name, phone, tags, is_opted_out, last_message_at, created_at, custom_fields",
    )
    .eq("tenant_id", TENANT_ID)
    .order("created_at", { ascending: false })
    .limit(100);

  const rows: ContactRow[] = (contacts ?? []) as any;

  const total = rows.length;
  const optedOut = rows.filter((c) => c.is_opted_out).length;
  const optedIn = total - optedOut;

  // 2) Load field definitions for this tenant (custom fields)
  const { data: fieldDefsRaw, error: fieldDefsError } = await supabaseAdmin
    .from("contact_field_definitions")
    .select("key, label, show_in_table, sort_order")
    .eq("tenant_id", TENANT_ID)
    .eq("show_in_table", true)
    .order("sort_order", { ascending: true });

  const customFields: FieldDef[] = (fieldDefsRaw ?? []) as any;

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Contacts</h1>
          <p className="text-xs text-slate-500">
            Leads stored for this workspace. Columns below follow your lead
            field settings.
          </p>
        </div>

        <div className="flex gap-2">
          <button className="rounded-lg border px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
            Import from CSV
          </button>
          <NewContactButton />
        </div>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3 text-xs">
        <div className="rounded-full bg-slate-100 px-3 py-1">
          Total contacts: <span className="font-semibold">{total}</span>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
          Opted-in: <span className="font-semibold">{optedIn}</span>
        </div>
        <div className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">
          Opted-out: <span className="font-semibold">{optedOut}</span>
        </div>
      </div>

      {/* Errors */}
      {error && (
        <div className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
          Failed to load contacts. Please refresh the page or contact support.
        </div>
      )}
      {fieldDefsError && (
        <div className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Failed to load lead field definitions. Showing default columns only.
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Phone</th>
              {customFields.map((field) => (
                <th key={field.key} className="px-3 py-2">
                  {field.label}
                </th>
              ))}
              <th className="px-3 py-2">Tags</th>
              <th className="px-3 py-2">Last activity</th>
              <th className="px-3 py-2">Created</th>
              <th className="px-3 py-2">Status</th>
              {/* NEW: actions column */}
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {rows.map((contact) => (
              <tr key={contact.id}>
                <td className="px-3 py-2 text-xs text-slate-800">
                  {contact.name || (
                    <span className="italic text-slate-400">No name</span>
                  )}
                </td>
                <td className="px-3 py-2 text-xs text-slate-700">
                  {contact.phone}
                </td>

                {/* Dynamic custom fields */}
                {customFields.map((field) => (
                  <td
                    key={field.key}
                    className="px-3 py-2 text-xs text-slate-600"
                  >
                    {contact.custom_fields?.[field.key] ?? "-"}
                  </td>
                ))}

                <td className="px-3 py-2 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {contact.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                    {!contact.tags?.length && (
                      <span className="text-[10px] italic text-slate-400">
                        No tags
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 text-xs text-slate-500">
                  {formatDate(contact.last_message_at)}
                </td>
                <td className="px-3 py-2 text-xs text-slate-500">
                  {formatDate(contact.created_at)}
                </td>
                <td className="px-3 py-2 text-xs">
                  <span
                    className={[
                      "rounded-full px-2 py-0.5 text-[10px] font-medium",
                      contact.is_opted_out
                        ? "bg-rose-50 text-rose-700"
                        : "bg-emerald-50 text-emerald-700",
                    ].join(" ")}
                  >
                    {contact.is_opted_out ? "Opted out" : "Subscribed"}
                  </span>
                </td>
                {/* NEW: Send WhatsApp action */}
                <td className="px-3 py-2 text-xs">
                  {!contact.is_opted_out && contact.phone ? (
                    <SendWhatsAppButton
                      phone={contact.phone}
                      tenantId={TENANT_ID}
                    />
                  ) : (
                    <span className="text-[10px] text-slate-400">
                      Not available
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {!rows.length && !error && (
              <tr>
                <td
                  colSpan={8 + customFields.length}
                  className="px-3 py-6 text-center text-xs text-slate-400"
                >
                  No contacts yet. Import a CSV or create your first contact.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
