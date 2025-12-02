import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

// Simple promo config: code -> trial days
const PROMO_TRIAL_DAYS: Record<string, number> = {
  LAUNCH30: 30,
  FREE60: 60,
};

export async function POST(req: Request) {
  try {
    const { tenant_id, promo_code } = await req.json();

    if (!tenant_id) {
      return NextResponse.json(
        { error: 'tenant_id is required' },
        { status: 400 }
      );
    }

    const promoCode = (promo_code as string | undefined)?.trim().toUpperCase();
    const baseDays = 14;
    const promoDays = promoCode && PROMO_TRIAL_DAYS[promoCode] ? PROMO_TRIAL_DAYS[promoCode] : baseDays;

    const now = new Date();
    const trialEnd = new Date(now.getTime() + promoDays * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('tenants')
      .update({
        plan_code: 'trial',
        billing_status: 'trialing',
        trial_start_at: now.toISOString(),
        trial_end_at: trialEnd.toISOString(),
        promo_code: promoCode || null,
      })
      .eq('id', tenant_id)
      .select(
        'id, name, slug, plan_code, billing_status, trial_start_at, trial_end_at, promo_code'
      )
      .single();

    if (error) {
      console.error('start-trial update error', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      tenant: data,
      days: promoDays,
    });
  } catch (err: any) {
    console.error('start-trial unexpected error', err);
    return NextResponse.json(
      { error: err?.message ?? 'Unexpected error' },
      { status: 500 }
    );
  }
}
