// app/customer/app/CustomerAppShell.tsx

import { ReactNode } from 'react';

// Option A: Simple (if workspace is truly optional right now)
interface CustomerAppShellProps {
  children: ReactNode;
  workspace?: any;          // ← add ? to make it optional
  // Better typing if you know the shape:
  // workspace?: { id: string; name: string; plan?: string; /* ... */ } | null;
}

export default function CustomerAppShell({
  children,
  workspace,              // ← can be undefined now
}: CustomerAppShellProps) {
  // Your existing shell logic...
  
  // Safely use workspace (add guards if needed)
  // const workspaceName = workspace?.name ?? 'Default Workspace';

  return (
    <div className="customer-app-shell">
      {/* header, sidebar, etc. that might use workspace */}
      <header>
        {/* example usage */}
        {workspace && <span>Workspace: {workspace.name}</span>}
      </header>
      
      <main>{children}</main>
      
      {/* footer, etc. */}
    </div>
  );
}