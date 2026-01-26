"use client";

import { useMemo, useState } from "react";
import NewContactButton from "./NewContactButton";
import RowActions from "./RowActions";
import { PreferredTemplateDropdown } from "./PreferredTemplateDropdown";
import FiltersBar from "./FiltersBar";
import ImportCsvButton from "./ImportCsvButton";

export type ContactRow = {
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

export type FieldDef = {
  key: string;
  label: string;
  show_in_table: boolean;
  sort_order: number;
  type?: string;
};

export type TemplateRow = {
  id: string;
  name: string;
};

type Props = {
  tenantId: string;
  initialRows: ContactRow[];
  fieldDefs: FieldDef[];
  templates: TemplateRow[];
  contactsError: boolean;
  fieldDefsError: boolean;
  templatesError: boolean;
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

export default function ContactsClient({
  tenantId,
  initialRows,
  fieldDefs,
  templates,
  contactsError,
  fieldDefsError,
  templatesError,
}: Props) {
  // Filter state (pure client-side)
  const [tag, setTag] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [fieldKey, setFieldKey] = useState("");
  const [fieldValue, setFieldValue] = useState("");

  const filteredRows = useMemo(() => {
    return initialRows.filter((c) => {
      // tag filter
      if (tag.trim()) {
        const t = tag.trim().toLowerCase();
        const matchesTag = (c.tags || []).some(
          (tg) => tg.toLowerCase() === t
        );
        if (!matchesTag) return false;
      }

      // template filter
      if (templateId) {
        if (c.preferred_template_id !== templateId) return false;
      }

      // custom field filter
      if (fieldKey && fieldValue.trim()) {
        const val = c.custom_fields?.[fieldKey];
        if (!val) return false;
        if (
          String(val).toLowerCase() !== fieldValue.trim().toLowerCase()
        ) {
          return false;
        }
      }

      return true;
    });
  }, [initialRows, tag, templateId, fieldKey, fieldValue]);

  const total = filteredRows.length;
  const optedOut = filteredRows.filter((c) => c.is_opted_out).length;
  const optedIn = total - optedOut;

  const exportHref = `/api/customer/contacts/export?tenantId=${encodeURIComponent(
    tenantId
  )}&tag=${encodeURIComponent(tag)}&fieldKey=${encodeURIComponent(
    fieldKey
  )}&fieldValue=${encodeURIComponent(
    fieldValue
  )}&templateId=${encodeURIComponent(templateId)}`;

  function clearFilters() {
    setTag("");
    setTemplateId("");
    setFieldKey("");
    setFieldValue("");
  }

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
          {/* Export CSV link with current filters */}
          <a
            href={exportHref}
            className="rounded-lg border px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Export CSV
          </a>

          {/* NEW: Import from CSV */}
          <ImportCsvButton tenantId={tenantId} fieldDefs={fieldDefs} />

          {/* New contact */}
          <NewContactButton tenantId={tenantId} fieldDefs={fieldDefs} />
        </div>
      </div>

      {/* Filters bar */}
      <FiltersBar
        tag={tag}
        templateId={templateId}
        fieldKey={fieldKey}
        fieldValue={fieldValue}
        onChangeTag={setTag}
        onChangeTemplateId={setTemplateId}
        onChangeFieldKey={setFieldKey}
        onChangeFieldValue={setFieldValue}
        onApply={() => {
          /* filtering is live; button kept for UX */
        }}
        onClear={clearFilters}
        templates={templates}
        customFields={fieldDefs}
      />

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
      {contactsError && (
        <div className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
          Failed to load contacts. Please refresh the page or contact support.
        </div>
      )}
      {fieldDefsError && (
        <div className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Failed to load lead field definitions. Showing default columns only.
        </div>
      )}
      {templatesError && (
        <div className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Failed to load templates for contact preferences.
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Phone</th>
              {fieldDefs.map((field) => (
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
            {filteredRows.map((contact) => (
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
                {fieldDefs.map((field) => (
                  <td
                    key={field.key}
                    className="px-3 py-2 text-xs text-slate-600"
                  >
                    {contact.custom_fields?.[field.key] ?? "-"}
                  </td>
                ))}

                {/* Preferred template dropdown */}
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
                    {contact.tags?.map((tg) => (
                      <span
                        key={tg}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600"
                      >
                        {tg}
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
                    fieldDefs={fieldDefs}
                  />
                </td>
              </tr>
            ))}

            {!filteredRows.length && !contactsError && (
              <tr>
                <td
                  colSpan={9 + fieldDefs.length}
                  className="px-3 py-6 text-center text-xs text-slate-400"
                >
                  No contacts match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
