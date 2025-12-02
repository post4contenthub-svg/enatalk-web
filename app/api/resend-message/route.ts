import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_FUNCTION_URL =
  'https://sfvkkioerqguspxhpjjj.functions.supabase.co/resend-message';

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function POST(req: NextRequest) {
  if (!ADMIN_SECRET) {
    console.error('ADMIN_SECRET env var is NOT set in Next.js server');
    return NextResponse.json(
      { error: 'Server misconfigured: ADMIN_SECRET missing' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    const res = await fetch(SUPABASE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'x-admin-secret': ADMIN_SECRET,     // 👈 key part
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('API /api/resend-message error', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
