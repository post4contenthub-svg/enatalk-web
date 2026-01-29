export default function AuthPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <iframe
        src="https://enatalk.com/enatalk-auth/?mode=login"
        className="w-full h-screen border-0"
        title="Enatalk Login"
      />
    </div>
  );
}