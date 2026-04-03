import Avatar from '@/components/Avatar';

function CallIcon({ type }) {
  if (type === 'video') {
    return (
      <svg fill="none" height="18" viewBox="0 0 24 24" width="18">
        <path
          d="M14 8.5H6.75C5.784 8.5 5 9.284 5 10.25V15.25C5 16.216 5.784 17 6.75 17H14C14.966 17 15.75 16.216 15.75 15.25V10.25C15.75 9.284 14.966 8.5 14 8.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M15.75 11.15L19 9.5V16L15.75 14.35V11.15Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg fill="none" height="18" viewBox="0 0 24 24" width="18">
      <path
        d="M7.2 4.75L10.1 7.15C10.52 7.5 10.67 8.08 10.48 8.59L9.63 10.79C10.44 12.39 11.72 13.63 13.3 14.4L15.47 13.5C15.98 13.29 16.58 13.41 16.95 13.82L19.4 16.62C19.84 17.12 19.87 17.87 19.47 18.4C18.8 19.29 17.75 19.8 16.64 19.8C10.5 19.8 5.52 14.82 5.52 8.68C5.52 7.55 6.05 6.5 6.96 5.82C7.49 5.43 8.24 5.46 8.72 5.88"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function DirectionArrow({ missed }) {
  return (
    <svg
      className={missed ? 'text-rose-500' : 'text-emerald-500'}
      fill="none"
      height="16"
      viewBox="0 0 24 24"
      width="16"
    >
      <path
        d="M7 8H16V17"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M16 8L7 17"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default function CallLogRow({ image, label, time, type, missed = false }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[26px] border border-sky-100 bg-white/85 p-4">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="h-12 w-12" label={label} src={image} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{label}</p>
          <div className="mt-1 flex items-center gap-2">
            <DirectionArrow missed={missed} />
            <p className="truncate text-xs text-slate-500">{time}</p>
          </div>
        </div>
      </div>

      <button
        className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-700 transition hover:bg-sky-100"
        type="button"
      >
        <CallIcon type={type} />
      </button>
    </div>
  );
}
