import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Send notification to your team
    await resend.emails.send({
      from: "EnaTalk Contact <noreply@enatalk.com>",
      to: "support@enatalk.com",
      replyTo: email,
      subject: `[Contact Form] ${subject} — from ${name}`,
      html: \`
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#16A34A;margin-bottom:4px;">New contact form submission</h2>
          <p style="color:#6b7280;font-size:14px;margin-bottom:24px;">EnaTalk Contact Form</p>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;width:100px;font-size:14px;">Name</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:14px;font-weight:600;">\${name}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:14px;">Email</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:14px;"><a href="mailto:\${email}" style="color:#16A34A;">\${email}</a></td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:14px;">Topic</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:14px;">\${subject}</td></tr>
          </table>
          <div style="margin-top:24px;padding:16px;background:#f9fafb;border-radius:8px;border-left:3px solid #16A34A;">
            <p style="color:#6b7280;font-size:12px;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
            <p style="font-size:14px;line-height:1.7;white-space:pre-wrap;">\${message}</p>
          </div>
          <p style="margin-top:24px;font-size:12px;color:#9ca3af;">Reply directly to this email to respond to \${name}.</p>
        </div>
      \`,
    });

    // Send auto-reply to user
    await resend.emails.send({
      from: "EnaTalk Support <noreply@enatalk.com>",
      to: email,
      subject: "We received your message — EnaTalk",
      html: \`
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#16A34A;">Hi \${name},</h2>
          <p style="color:#374151;line-height:1.7;margin:16px 0;">Thanks for reaching out to EnaTalk. We've received your message and will get back to you at <strong>\${email}</strong> within 24 hours on business days.</p>
          <div style="padding:16px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;margin:20px 0;">
            <p style="color:#15803d;font-size:14px;margin:0;">⏱ Expected response: <strong>within 24 hours</strong> (Mon–Sat, 10am–6pm IST)</p>
          </div>
          <p style="color:#6b7280;font-size:14px;line-height:1.7;">For urgent platform issues, you can also reach us on WhatsApp: <a href="https://wa.me/919062211526" style="color:#16A34A;">+91 90622 11526</a></p>
          <hr style="border:none;border-top:1px solid #f3f4f6;margin:24px 0;"/>
          <p style="color:#9ca3af;font-size:12px;">EnaTalk · Ramkrishna Upanibesh Jadavpur, Kolkata, West Bengal 700092, India</p>
        </div>
      \`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}
