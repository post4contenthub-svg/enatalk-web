import { createSupabaseServerClient } from '@/lib/supabase/server';
import CustomerAppShell from './CustomerAppShell';  // ← fixed
import { redirect } from 'next/navigation';

export default async function CustomerAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // If you want to pass workspace (optional for now)
  // const { data: workspace } = await ... fetch workspace ...

  return (
    <CustomerAppShell /* workspace={workspace} */>
      {children}
    </CustomerAppShell>
  );
}