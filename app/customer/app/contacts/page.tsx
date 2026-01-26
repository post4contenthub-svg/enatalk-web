import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ContactsClient from "./ContactsClient";
import ImportCsvButton from "./ImportCsvButton";

const TENANT_ID = "5ddd6091-ba29-4b65-8684-f9da79f28af7";

/**
 * Contacts are DATA ONLY.
 * No templates, no messaging logic.
 * CRM-ready.
 */
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
  type?: string;
};

export default async function ContactsPage() {
  /**
   * 1) Load contacts
   * NOTE: No template fields here.
   */
  const { data: contacts, error: contactsError } = await supabaseAdmin
    .from("contacts")
    .select(
      "id, name, phone, tags, is_opted_out, last_message_at, created_at, custom_fields"
    )
    .eq("tenant_id", TENANT_ID)
    .order("created_at", { ascending: false })
    .limit(100);

  const rows: ContactRow[] = (contacts ?? []) as any;

  /**
   * 2) Load custom field definitions
   */
  const { data: fieldDefsRaw, error: fieldDefsError } = await supabaseAdmin
    .from("contact_field_definitions")
    .select("key, label, show_in_table, sort_order, type")
    .eq("tenant_id", TENANT_ID)
    .eq("show_in_table", true)
    .order("sort_order", { ascending: true });

  const customFields: FieldDef[] = (fieldDefsRaw ?? []) as any;

  /**
   * 3) Render client component
   * NOTE: No templates passed anymore.
   */
  return (
    <ContactsClient
      tenantId={TENANT_ID}
      initialRows={rows}
      fieldDefs={customFields}
      contactsError={!!contactsError}
      fieldDefsError={!!fieldDefsError}
    />
  );
}