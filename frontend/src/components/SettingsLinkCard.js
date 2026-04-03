export default function SettingsLinkCard({ label, subtitle, icon }) {
  return (
    <button
      className="flex w-full items-center justify-between gap-4 rounded-[26px] border border-sky-100 bg-white/85 px-4 py-4 text-left transition hover:border-sky-200 hover:bg-white"
      type="button"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-700">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{label}</p>
          <p className="truncate text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>

      <svg className="shrink-0 text-slate-300" fill="none" height="18" viewBox="0 0 24 24" width="18">
        <path d="M9 6L15 12L9 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    </button>
  );
}
