// app/customer/app/contacts/ContactsFiltersBar.tsx
"use client";

type TemplateRow = {
  id: string;
  name?: string | null;
};

type FieldDef = {
  key: string;
  label: string;
};

export type ContactsFiltersBarProps = {
  availableTemplates: TemplateRow[];
  customFields: FieldDef[];

  tag: string;
  templateId: string;
  fieldKey: string;
  fieldValue: string;

  onChangeTag: (v: string) => void;
  onChangeTemplateId: (v: string) => void;
  onChangeFieldKey: (v: string) => void;
  onChangeFieldValue: (v: string) => void;

  onClear: () => void;
};

export function ContactsFiltersBar({
  availableTemplates,
  customFields,
  tag,
  templateId,
  fieldKey,
  fieldValue,
  onChangeTag,
  onChangeTemplateId,
  onChangeFieldKey,
  onChangeFieldValue,
  onClear,
}: ContactsFiltersBarProps) {
  return (
    <div className="flex flex-wrap gap-2 items-end">
      <input
        value={tag}
        onChange={(e) => onChangeTag(e.target.value)}
        placeholder="Tag"
        className="border px-2 py-1 rounded text-xs"
      />

      <select
        value={templateId}
        onChange={(e) => onChangeTemplateId(e.target.value)}
        className="border px-2 py-1 rounded text-xs"
      >
        <option value="">All templates</option>
        {availableTemplates.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name || t.id}
          </option>
        ))}
      </select>

      <select
        value={fieldKey}
        onChange={(e) => onChangeFieldKey(e.target.value)}
        className="border px-2 py-1 rounded text-xs"
      >
        <option value="">Field</option>
        {customFields.map((f) => (
          <option key={f.key} value={f.key}>
            {f.label}
          </option>
        ))}
      </select>

      <input
        value={fieldValue}
        onChange={(e) => onChangeFieldValue(e.target.value)}
        placeholder="Value"
        className="border px-2 py-1 rounded text-xs"
      />

      <button
        type="button"
        onClick={onClear}
        className="border px-3 py-1 rounded text-xs"
      >
        Clear
      </button>
    </div>
  );
}