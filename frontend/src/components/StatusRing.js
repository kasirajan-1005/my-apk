import Avatar from '@/components/Avatar';

export default function StatusRing({ active = false, image, label, subtitle }) {
  return (
    <div className="flex items-center gap-3 rounded-[26px] border border-sky-100 bg-white/85 p-3">
      <div
        className={`rounded-full p-[3px] ${
          active
            ? 'bg-[conic-gradient(from_180deg,var(--brand),#67e8f9,var(--brand-deep),var(--brand))]'
            : 'bg-slate-200'
        }`}
      >
        <div className="rounded-full bg-white p-[3px]">
          <Avatar className="h-12 w-12" label={label} src={image} />
        </div>
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900">{label}</p>
        <p className="truncate text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}
