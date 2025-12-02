// app/admin/page.tsx
export default function AdminHomePage() {
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>
        Admin Dashboard
      </h1>
      <p style={{ marginBottom: 8 }}>
        Internal Enatalk admin. Use this area to inspect tenants, messages and test
        WhatsApp sending.
      </p>
      <ul style={{ marginLeft: 18, marginTop: 8, fontSize: 14 }}>
        <li>
          View and resend messages in <code>/admin/messages</code>
        </li>
        <li>
          Send test messages in <code>/admin/test-whatsapp</code>
        </li>
      </ul>
    </div>
  );
}
