// lib/whatsapp.ts

export type SendWhatsappResult = {
  success: boolean;
  status: number;
  messageId?: string | null;
  raw?: any;
};

/* ============================================================
   TEXT MESSAGE (ONLY WORKS IF USER REPLIED < 24 HOURS)
============================================================ */

export async function sendWhatsappMessage({
  to,
  body,
}: {
  to: string; // E.164 without +
  body: string;
}): Promise<SendWhatsappResult> {
  const res = await fetch(
    `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
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

/* ============================================================
   TEMPLATE MESSAGE (ALWAYS ALLOWED – FIRST / PROMO MESSAGE)
============================================================ */

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
    `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
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