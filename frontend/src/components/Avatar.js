export default function Avatar({ src, label, className = '' }) {
  const initial = label?.[0]?.toUpperCase() || 'D';

  if (src) {
    return (
      <div className={`overflow-hidden rounded-full bg-white ${className}`.trim()}>
        <img alt={label || 'Avatar'} className="h-full w-full object-cover" src={src} />
      </div>
    );
  }

  return (
    <div
      className={`brand-gradient flex items-center justify-center rounded-full text-white ${className}`.trim()}
    >
      <span className="text-lg font-semibold">{initial}</span>
    </div>
  );
}
