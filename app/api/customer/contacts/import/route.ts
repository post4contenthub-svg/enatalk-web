import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type FieldDef = {
  key: string;
};

function parseCsv(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (!lines.length) {
    return { headers: [] as string[], rows: [] as string[][] };
  }

  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const cols = line.split(",");
    // pad missing columns
    while (cols.length < headers.length) cols.push("");
    return cols.map((c) => c.trim());
  });

  return { headers, rows };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const tenantId = body?.tenantId as string | undefined;
    const csvText = body?.csvText as string | undefined;

    if (!tenantId || !csvText) {
      return NextResponse.json(
        { error: "Missing tenantId or csvText" },
        { status: 400 }
      );
    }

    const { headers, rows } = parseCsv(csvText);

    if (!headers.length) {
      return NextResponse.json(
        { error: "CSV is empty or could not be parsed" },
        { status: 400 }
      );
    }

    const phoneIndex = headers.indexOf("phone");
    if (phoneIndex === -1) {
      return NextResponse.json(
        { error: 'CSV must have a "phone" column' },
        { status: 400 }
      );
    }

    // Load valid custom field keys for this tenant
    const { data: fieldDefs, error: fieldErr } = await supabaseAdmin
      .from("contact_field_definitions")
      .select("key")
      .eq("tenant_id", tenantId);

    if (fieldErr) {
      console.error("field defs load error", fieldErr);
      return NextResponse.json(
        { error: "Failed to load field definitions" },
        { status: 500 }
      );
    }

    const validCustomKeys = new Set(
      (fieldDefs as FieldDef[]).map((f) => f.key)
    );
    // name/phone are top-level, not custom_fields
    validCustomKeys.delete("name");
    validCustomKeys.delete("phone");

    const payload: any[] = [];
    let skipped = 0;

    for (const row of rows) {
      const phoneRaw = (row[phoneIndex] || "").replace(/\s+/g, "");
      if (!phoneRaw) {
        skipped++;
        continue;
      }

      // Map headers → values
      const record: Record<string, string> = {};
      headers.forEach((h, i) => {
        record[h] = row[i] ?? "";
      });

      const name = (record["name"] || "").trim() || null;

      const custom_fields: Record<string, any> = {};
      for (const key of validCustomKeys) {
        if (record[key] && record[key].trim() !== "") {
          custom_fields[key] = record[key].trim();
        }
      }

      payload.push({
        tenant_id: tenantId,
        phone: phoneRaw,
        name,
        custom_fields: Object.keys(custom_fields).length
          ? custom_fields
          : null,
      });
    }

    if (!payload.length) {
      return NextResponse.json(
        { imported: 0, skipped },
        { status: 200 }
      );
    }

    // Upsert by (tenant_id, phone) so importing same CSV again updates
    const { error: insertErr } = await supabaseAdmin
      .from("contacts")
      .upsert(payload, {
        onConflict: "tenant_id,phone",
      });

    if (insertErr) {
      console.error("contacts import error", insertErr);
      return NextResponse.json(
        { error: "Failed to insert contacts" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { imported: payload.length, skipped },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("contacts import route error", err);
    return NextResponse.json(
      { error: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
