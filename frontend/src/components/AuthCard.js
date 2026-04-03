import PanelCard from '@/components/PanelCard';

export default function AuthCard({
  mobileNumber,
  pin,
  onMobileChange,
  onPinChange,
  onSubmit,
  loading,
  error
}) {
  return (
    <PanelCard className="w-full max-w-4xl overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="relative overflow-hidden p-8 sm:p-10">
          <div className="absolute inset-x-6 top-6 h-32 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="relative">
            <div className="glass-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              Real-time chat
            </div>
            <h1 className="mt-6 max-w-md text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
              DM to Kasi
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">
              A glossy sky-blue chat experience for private conversations with Kasi, complete with
              live replies, custom wallpapers, and an admin control room.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[26px] border border-white/70 bg-white/75 p-5">
                <p className="text-sm font-semibold text-slate-900">Mobile-first login</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Users sign in with a mobile number only. Admin access unlocks automatically with
                  the correct PIN.
                </p>
              </div>
              <div className="rounded-[26px] border border-white/70 bg-white/75 p-5">
                <p className="text-sm font-semibold text-slate-900">WhatsApp-inspired chat</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Rounded bubbles, responsive layout, and quick media personalization without
                  leaving the thread.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/60 bg-white/65 p-8 sm:p-10 lg:border-l lg:border-t-0">
          <h2 className="text-2xl font-semibold text-slate-950">Welcome back</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Enter your mobile number to continue. The PIN field is only needed for admin access.
          </p>

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Mobile number</span>
              <input
                className="w-full rounded-2xl border border-sky-100 bg-white/95 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                inputMode="numeric"
                maxLength={10}
                onChange={(event) => onMobileChange(event.target.value)}
                placeholder="Enter 10-digit mobile number"
                value={mobileNumber}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Admin PIN (optional)
              </span>
              <input
                className="w-full rounded-2xl border border-sky-100 bg-white/95 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                inputMode="numeric"
                maxLength={6}
                onChange={(event) => onPinChange(event.target.value)}
                placeholder="Only for Kasi"
                type="password"
                value={pin}
              />
            </label>

            {error ? (
              <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <button
              className="brand-gradient w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
              type="submit"
            >
              {loading ? 'Signing in...' : 'Enter chat'}
            </button>
          </form>
        </div>
      </div>
    </PanelCard>
  );
}
