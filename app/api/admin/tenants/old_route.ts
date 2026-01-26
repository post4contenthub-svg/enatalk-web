import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .select(
        'id, name, slug, plan_code, billing_status, trial_start_at, trial_end_at, promo_code'
      )
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading tenants (admin API):', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tenants: data ?? [] });
  } catch (err: any) {
    console.error('Unexpected error loading tenants (admin API):', err);
    return NextResponse.json(
      { error: err?.message ?? 'Unexpected error' },
      { status: 500 }
    );
  }
}
