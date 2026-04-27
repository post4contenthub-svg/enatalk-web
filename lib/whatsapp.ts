// lib/whatsapp.ts

export type SendWhatsappResult = {
  success: boolean;
  status: number;
  messageId?: string | null;
  raw?: any;
};

// ─── Send using TENANT's own WhatsApp number ───
// Used for campaigns — each customer sends from their own number
export async function sendWhatsappMessageAsTenant({
  to,
  body,
  phoneNumberId,
  accessToken,
}: {
  to: string;           // E.164 without + e.g. "919876543210"
  body: string;
  phoneNumberId: string;
  accessToken: string;
}): Promise<SendWhatsappResult> {
  const res = await fetch(
    `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body },
      }),
    }
  );

  const json = await res.json();
  return {
    success: res.ok,
    status: res.status,
    messageId: json?.messages?.[0]?.id ?? null,
    raw: json,
  };
}

// ─── Send template using TENANT's own WhatsApp number ───
// Always use this for first contact / campaigns
export async function sendWhatsAppTemplateAsTenant({
  to,
  templateName,
  language = "en",
  components = [],
  phoneNumberId,
  accessToken,
}: {
  to: string;
  templateName: string;
  language?: string;
  components?: any[];
  phoneNumberId: string;
  accessToken: string;
}): Promise<SendWhatsappResult> {
  const res = await fetch(
    `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: { code: language },
          components,
        },
      }),
    }
  );

  const json = await res.json();
  return {
    success: res.ok,
    status: res.status,
    messageId: json?.messages?.[0]?.id ?? null,
    raw: json,
  };
}

// ─── Send using MASTER EnaTalk number ───
// Used for system messages, notifications
export async function sendWhatsappMessage({
  to,
  body,
}: {
  to: string;
  body: string;
}): Promise<SendWhatsappResult> {
  const res = await fetch(
    `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_BEARER}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body },
      }),
    }
  );

  const json = await res.json();
  return {
    success: res.ok,
    status: res.status,
    messageId: json?.messages?.[0]?.id ?? null,
    raw: json,
  };
}

// ─── Send template using MASTER EnaTalk number ───
export async function sendWhatsAppTemplate({
  to,
  templateName,
  language = "en",
  components = [],
}: {
  to: string;
  templateName: string;
  language?: string;
  components?: any[];
}): Promise<SendWhatsappResult> {
  const res = await fetch(
    `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_BEARER}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: { code: language },
          components,
        },
      }),
    }
  );

  const json = await res.json();
  return {
    success: res.ok,
    status: res.status,
    messageId: json?.messages?.[0]?.id ?? null,
    raw: json,
  };
}
