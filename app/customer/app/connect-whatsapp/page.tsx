"use client";

export default function ConnectWhatsAppPage() {
  const handleConnect = () => {
    alert("Meta connection will start here");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
      <div className="w-full max-w-md rounded-xl bg-slate-800 p-6 space-y-4">
        <h1 className="text-xl font-semibold">Connect your WhatsApp Business</h1>

        <p className="text-sm text-slate-400">
          Connect your official WhatsApp Business account to start sending messages.
        </p>

        <button
          onClick={handleConnect}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm hover:bg-emerald-700"
        >
          Connect with Meta
        </button>

        <p className="text-xs text-slate-500">
          We use the official WhatsApp Cloud API. Your data is safe.
        </p>
      </div>
    </div>
  );
}
