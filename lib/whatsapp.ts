export type SendWhatsappPayload = {
  to: string; // E.164 without +
  body: string;
};

export type SendWhatsappResult = {
  success: boolean;
  status: number;
  messageId?: string | null;
  raw?: any;
};

export async function sendWhatsappMessage(
  payload: SendWhatsappPayload
): Promise<SendWhatsappResult> {
  const res = await fetch('/api/resend-message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: payload.to,
      type: 'text',
      text: { body: payload.body },
    }),
  });

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    // ignore
  }

  return {
    success: res.ok && json?.success === true,
    status: res.status,
    messageId: json?.message_id ?? null,
    raw: json,
  };
}
