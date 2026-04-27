import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function findPhoneKey(headers: string[]) {
  const possible = ["phone", "mobile", "phone number", "contact", "whatsapp"];
  return headers.find((h: string) =>
    possible.includes(h.toLowerCase().trim())
  );
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  try {
    const { csvText } = await req.json();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = user.id;

    const lines = csvText.split("\n").filter(Boolean);
    if (lines.length < 2) {
      return NextResponse.json({ imported: 0 });
    }

    const headers = lines[0].split(",").map((h: string) => h.trim());

    const phoneKey = findPhoneKey(headers);

    if (!phoneKey) {
      return NextResponse.json({
        error: "No phone column found in CSV",
      }, { status: 400 });
    }

    const rows: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v: string) => v.trim());

      const obj: Record<string, string> = {};
      headers.forEach((h: string, idx: number) => {
        obj[h] = values[idx] || "";
      });

      let phone = obj[phoneKey];

      if (!phone) continue;

      // Clean number
      phone = phone.replace(/\D/g, "");

      if (phone.startsWith("91") && phone.length === 12) {
        phone = phone.slice(2);
      }

      const name =
        obj["Name"] ||
        obj["name"] ||
        obj["Business Name"] ||
        "";

      delete obj[phoneKey];

      rows.push({
        tenant_id: tenantId,
        name,
        phone,
        custom_data: obj,
      });
    }

    if (rows.length === 0) {
      return NextResponse.json({ imported: 0 });
    }

    const { error } = await supabase
      .from("tenant_contacts")
      .insert(rows);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ imported: rows.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
