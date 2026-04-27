// app/api/webhooks/whatsapp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// ─── GET: Meta webhook verification ───
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const mode      = sp.get("hub.mode");
  const token     = sp.get("hub.verify_token");
  const challenge = sp.get("hub.challenge");

  if (
    mode === "subscribe" &&
    token === process.env.WHATSAPP_VERIFY_TOKEN &&
    challenge
  ) {
    console.log("✅ Webhook verified");
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  console.warn("❌ Webhook verification failed", { mode, token });
  return new NextResponse("Forbidden", { status: 403 });
}

// ─── POST: Receive messages & status updates from Meta ───
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Meta sends an array of entries
    const entries = body.entry || [];

    for (const entry of entries) {
      const changes = entry.changes || [];

      for (const change of changes) {
        const value = change.value;

        if (!value) continue;

        // ── 1. DELIVERY STATUS UPDATES ──
        // Fired when message is sent, delivered, or read
        if (value.statuses?.length) {
          for (const status of value.statuses) {
            await handleStatusUpdate(status, value.metadata);
          }
        }

        // ── 2. INBOUND MESSAGES ──
        // Fired when someone replies to your WhatsApp number
        if (value.messages?.length) {
          for (const message of value.messages) {
            await handleInboundMessage(message, value.metadata, value.contacts);
          }
        }
      }
    }

    // Always return 200 to Meta — otherwise it will retry
    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("Webhook error:", err);
    // Still return 200 so Meta doesn't keep retrying
    return NextResponse.json({ ok: true });
  }
}

// ─── Handle delivery status updates ───
async function handleStatusUpdate(status: any, metadata: any) {
  const messageId    = status.id;
  const newStatus    = status.status;   // sent | delivered | read | failed
  const phoneNumberId = metadata?.phone_number_id;
  const timestamp    = status.timestamp;

  console.log(`📊 Status update: ${messageId} → ${newStatus}`);

  // Map Meta status to our status
  const statusMap: Record<string, string> = {
    sent:      "sent",
    delivered: "delivered",
    read:      "read",
    failed:    "failed",
  };

  const mappedStatus = statusMap[newStatus] || newStatus;

  // Find which tenant owns this phone number
  const { data: waAccount } = await supabaseAdmin
    .from("tenant_whatsapp_accounts")
    .select("tenant_id")
    .eq("phone_number_id", phoneNumberId)
    .maybeSingle();

  if (!waAccount) {
    console.warn("No tenant found for phone_number_id:", phoneNumberId);
    return;
  }

  // Update message status in our messages table
  const { error } = await supabaseAdmin
    .from("messages")
    .update({
      status: mappedStatus,
      delivered_at: newStatus === "delivered" ? new Date(timestamp * 1000).toISOString() : undefined,
      read_at:      newStatus === "read"      ? new Date(timestamp * 1000).toISOString() : undefined,
      updated_at:   new Date().toISOString(),
    })
    .eq("whatsapp_message_id", messageId)
    .eq("tenant_id", waAccount.tenant_id);

  if (error) {
    console.error("Error updating message status:", error);
  } else {
    console.log(`✅ Updated message ${messageId} to ${mappedStatus}`);
  }

  // Also update campaign stats if this message belongs to a campaign
  if (mappedStatus === "delivered" || mappedStatus === "read") {
    await updateCampaignStats(messageId, mappedStatus, waAccount.tenant_id);
  }
}

// ─── Handle inbound messages (customer replies) ───
async function handleInboundMessage(message: any, metadata: any, contacts: any[]) {
  const from          = message.from;         // sender's phone number
  const messageId     = message.id;
  const phoneNumberId = metadata?.phone_number_id;
  const timestamp     = message.timestamp;
  const type          = message.type;          // text | image | audio | etc

  // Get message text
  let messageText = "";
  if (type === "text") {
    messageText = message.text?.body || "";
  } else {
    messageText = `[${type} message]`;
  }

  // Get contact name if available
  const contact = contacts?.find((c: any) => c.wa_id === from);
  const contactName = contact?.profile?.name || from;

  console.log(`📩 Inbound message from ${from} (${contactName}): ${messageText}`);

  // Find which tenant owns this phone number
  const { data: waAccount } = await supabaseAdmin
    .from("tenant_whatsapp_accounts")
    .select("tenant_id")
    .eq("phone_number_id", phoneNumberId)
    .maybeSingle();

  if (!waAccount) {
    console.warn("No tenant found for phone_number_id:", phoneNumberId);
    return;
  }

  // Save inbound message to database
  const { error } = await supabaseAdmin
    .from("inbound_messages")
    .insert({
      tenant_id:           waAccount.tenant_id,
      from_number:         from,
      from_name:           contactName,
      message_text:        messageText,
      message_type:        type,
      whatsapp_message_id: messageId,
      received_at:         new Date(timestamp * 1000).toISOString(),
      is_read:             false,
      raw_payload:         message,
    });

  if (error) {
    // Table might not exist yet — log but don't crash
    console.error("Error saving inbound message:", error.message);
  } else {
    console.log(`✅ Saved inbound message from ${from}`);
  }
}

// ─── Update campaign delivered/read counts ───
async function updateCampaignStats(
  messageId: string,
  status: string,
  tenantId: string
) {
  // Find the campaign this message belongs to
  const { data: message } = await supabaseAdmin
    .from("messages")
    .select("campaign_id")
    .eq("whatsapp_message_id", messageId)
    .eq("tenant_id", tenantId)
    .maybeSingle();

  if (!message?.campaign_id) return;

  // Increment the right counter
  const updateField = status === "delivered"
    ? { delivered_count: 1 }
    : { read_count: 1 };

  // Use raw SQL increment to avoid race conditions
  if (status === "delivered") {
    await supabaseAdmin.rpc("increment_campaign_delivered", {
      campaign_id: message.campaign_id,
    });
  } else if (status === "read") {
    await supabaseAdmin.rpc("increment_campaign_read", {
      campaign_id: message.campaign_id,
    });
  }
}
