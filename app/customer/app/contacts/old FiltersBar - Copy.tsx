"use client";

type TemplateOption = {
  id: string;
  name: string;
};

type FieldOption = {
  key: string;
  label: string;
};

export default function FiltersBar({
  tag,
  templateId,
  fieldKey,
  fieldValue,
  onChangeTag,
  onChangeTemplateId,
  onChangeFieldKey,
  onChangeFieldValue,
  onClear,
  onApply,
  templates,
  customFields,
}: {
  tag: string;
  templateId: string;
  fieldKey: string;
  fieldValue: string;

  onChangeTag: (v: string) => void;
  onChangeTemplateId: (v: string) => void;
  onChangeFieldKey: (v: string) => void;
  onChangeFieldValue: (v: string) => void;

  onClear: () => void;
  onApply: () => void;

  templates: TemplateOption[];
  customFields: FieldOption[];
}) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border bg-white p-3 text-xs">

      {/* Tag */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] text-slate-600">Filter by tag</label>
        <input
          className="w-40 rounded border px-2 py-1"
          placeholder="e.g. Lead"
          value={tag}
          onChange={(e) => onChangeTag(e.target.value)}
        />
      </div>

      {/* Template */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] text-slate-600">Filter by template</label>
        <select
          className="w-48 rounded border px-2 py-1"
          value={templateId}
          onChange={(e) => onChangeTemplateId(e.target.value)}
        >
          <option value="">All templates</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Custom field filter */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] text-slate-600">Filter by field</label>
        <div className="flex gap-2">
          <select
            className="w-40 rounded border px-2 py-1"
            value={fieldKey}
            onChange={(e) => onChangeFieldKey(e.target.value)}
          >
            <option value="">Choose field</option>
            {customFields.map((f) => (
              <option key={f.key} value={f.key}>
                {f.label}
              </option>
            ))}
          </select>

          <input
            className="w-48 rounded border px-2 py-1"
            placeholder="Exact value"
            value={fieldValue}
            onChange={(e) => onChangeFieldValue(e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="ml-auto flex gap-2">
        <button
          type="button"
          onClick={onClear}
          className="rounded border px-3 py-1 text-[11px] text-slate-600 hover:bg-slate-50"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={onApply}
          className="rounded bg-slate-800 px-3 py-1 text-[11px] font-medium text-white hover:bg-slate-900"
        >
          Apply filters
        </button>
      </div>
    </div>
  );
}
