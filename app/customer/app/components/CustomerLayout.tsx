export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 font-bold text-lg">EnaTalk</div>
        <nav className="flex-1 px-3 space-y-1">
          {[
            "Overview",
            "Campaigns",
            "Templates",
            "Contacts",
            "Analytics",
            "Settings",
          ].map((item) => (
            <a
              key={item}
              href="#"
              className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              {item}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <div className="font-semibold">Demo Workspace</div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Trial – 7 days left
            </span>
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
              CU
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
