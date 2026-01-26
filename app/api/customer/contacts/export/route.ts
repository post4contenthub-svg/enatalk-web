import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const tenantId = searchParams.get("tenantId");
  const tag = searchParams.get("tag");
  const templateId = searchParams.get("templateId");
  const fieldKey = searchParams.get("fieldKey");
  const fieldValue = searchParams.get("fieldValue");

  if (!tenantId) {
    return NextResponse.json(
      { error: "tenantId is required" },
      { status: 400 }
    );
  }

  let query = supabaseAdmin
    .from("contacts")
    .select(
      "id, name, phone, tags, custom_fields, created_at, last_message_at, is_opted_out, preferred_template_id"
    )
    .eq("tenant_id", tenantId);

  // Filter by Tag
  if (tag) {
    query = query.contains("tags", [tag]);
  }

  // Filter by Preferred Template
  if (templateId) {
    query = query.eq("preferred_template_id", templateId);
  }

  // Filter by Custom Field
  if (fieldKey && fieldValue) {
    query = query.eq(`custom_fields->>${fieldKey}`, fieldValue);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const rows = data || [];

  // Build CSV
  const header = [
    "id",
    "name",
    "phone",
    "tags",
    "custom_fields",
    "preferred_template_id",
    "created_at",
    "last_message_at",
    "is_opted_out",
  ];

  const csvLines = [
    header.join(","),
    ...rows.map((c) =>
      [
        c.id,
        c.name ?? "",
        c.phone,
        JSON.stringify(c.tags ?? []),
        JSON.stringify(c.custom_fields ?? {}),
        c.preferred_template_id ?? "",
        c.created_at ?? "",
        c.last_message_at ?? "",
        c.is_opted_out ? "true" : "false",
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    ),
  ];

  const csvData = csvLines.join("\n");

  return new NextResponse(csvData, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=contacts_filtered.csv",
    },
  });
}
