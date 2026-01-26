// app/customer/app/contacts/ContactsPageClient.tsx
"use client";

import { useMemo, useState } from "react";
import NewContactButton from "./NewContactButton";
import { PreferredTemplateDropdown } from "./PreferredTemplateDropdown";
import RowActions from "./RowActions";
import { ContactsFiltersBar } from "./ContactsFiltersBar";
type ContactRow = {
  id: string;
  name: string | null;
  phone: string;
  tags: string[] | null;
  is_opted_out: boolean;
  last_message_at: string | null;
  created_at: string;
  custom_fields: Record<string, any> | null;
  preferred_template_id: string | null;
};

type FieldDef = {
  key: string;
  label: string;
  show_in_table: boolean;
  sort_order: number;
  type?: string;
};

type TemplateRow = {
  id: string;
  name: string;
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

export default function ContactsPageClient({
  tenantId,
  initialContacts,
  customFields,
  templates,
  hasContactsError,
  hasFieldDefsError,
  hasTemplatesError,
}: {
  tenantId: string;
  initialContacts: ContactRow[];
  customFields: FieldDef[];
  templates: TemplateRow[];
  hasContactsError: boolean;
  hasFieldDefsError: boolean;
  hasTemplatesError: boolean;
}) {
  // Filter state – this controls BOTH the bar + table
  const [tag, setTag] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [fieldKey, setFieldKey] = useState("");
  const [fieldValue, setFieldValue] = useState("");

  const handleClearFilters = () => {
    setTag("");
    setTemplateId("");
    setFieldKey("");
    setFieldValue("");
  };

  // Apply filters in memory
  const rows = useMemo(() => {
    let list = initialContacts;

    if (tag.trim()) {
      const t = tag.trim().toLowerCase();
      list = list.filter((c) =>
        (c.tags ?? []).some((tg) => tg.toLowerCase() === t),
      );
    }

    if (templateId) {
      list = list.filter(
        (c) => c.preferred_template_id === templateId,
      );
    }

    if (fieldKey && fieldValue.trim()) {
      const v = fieldValue.trim().toLowerCase();
      list = list.filter((c) => {
        const cfVal = c.custom_fields?.[fieldKey];
        if (cfVal == null) return false;
        return String(cfVal).toLowerCase() === v;
      });
    }

    return list;
  }, [initialContacts, tag, templateId, fieldKey, fieldValue]);

  const total = rows.length;
  const optedOut = rows.filter((c) => c.is_opted_out).length;
  const optedIn = total - optedOut;

  // Export URL that respects filters
  const exportParams = new URLSearchParams();
  exportParams.set("tenantId", tenantId);
  if (tag.trim()) exportParams.set("tag", tag.trim());
  if (templateId) exportParams.set("templateId", templateId);
  if (fieldKey && fieldValue.trim()) {
    exportParams.set("fieldKey", fieldKey);
    exportParams.set("fieldValue", fieldValue.trim());
  }
  const exportHref = `/api/customer/contacts/export?${exportParams.toString()}`;

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
          {/* Export CSV (with filters) */}
          <a
            href={exportHref}
            className="rounded-lg border px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Export CSV
          </a>

          {/* Import placeholder */}
          <button className="rounded-lg border px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
            Import from CSV
          </button>

          <NewContactButton tenantId={tenantId} fieldDefs={customFields} />
        </div>
      </div>

      {/* Filters bar */}
      <ContactsFiltersBar
availableTemplates={templates}
customFields={customFields}
tag={tag}
templateId={templateId}
fieldKey={fieldKey}
fieldValue={fieldValue}
onChangeTag={setTag}
onChangeTemplateId={setTemplateId}
onChangeFieldKey={setFieldKey}
onChangeFieldValue={setFieldValue}
onClear={handleClearFilters}
/>

      {/* Summary for FILTERED list */}
      <div className="flex flex-wrap gap-3 text-xs">
        <div className="rounded-full bg-slate-100 px-3 py-1">
          Showing contacts: <span className="font-semibold">{total}</span>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
          Opted-in: <span className="font-semibold">{optedIn}</span>
        </div>
        <div className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">
          Opted-out: <span className="font-semibold">{optedOut}</span>
        </div>
      </div>

      {/* Errors */}
      {hasContactsError && (
        <div className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
          Failed to load contacts.
        </div>
      )}
      {hasFieldDefsError && (
        <div className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Failed to load lead field definitions.
        </div>
      )}
      {hasTemplatesError && (
        <div className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Failed to load templates.
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
              <th className="px-3 py-2">Template</th>
              <th className="px-3 py-2">Tags</th>
              <th className="px-3 py-2">Last activity</th>
              <th className="px-3 py-2">Created</th>
              <th className="px-3 py-2">Status</th>
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

                {/* Custom fields */}
                {customFields.map((field) => (
                  <td
                    key={field.key}
                    className="px-3 py-2 text-xs text-slate-600"
                  >
                    {contact.custom_fields?.[field.key] ?? "-"}
                  </td>
                ))}

                {/* Preferred template */}
                <td className="px-3 py-2 text-xs">
                  <PreferredTemplateDropdown
                    contactId={contact.id}
                    tenantId={tenantId}
                    templates={templates}
                    currentTemplateId={contact.preferred_template_id}
                  />
                </td>

                {/* Tags */}
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

                <td className="px-3 py-2 text-xs">
                  <RowActions
                    contact={contact as any}
                    tenantId={tenantId}
                    fieldDefs={customFields}
                  />
                </td>
              </tr>
            ))}

            {!rows.length && !hasContactsError && (
              <tr>
                <td
                  colSpan={9 + customFields.length}
                  className="px-3 py-6 text-center text-xs text-slate-400"
                >
                  No contacts found for current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
