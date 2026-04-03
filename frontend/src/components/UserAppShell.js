'use client';

import Link from 'next/link';
import Avatar from '@/components/Avatar';

const NAV_ITEMS = [
  {
    href: '/chat',
    label: 'Chats',
    icon: 'chat'
  },
  {
    href: '/status',
    label: 'Status',
    icon: 'status'
  },
  {
    href: '/calls',
    label: 'Calls',
    icon: 'call'
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: 'settings'
  }
];

function Icon({ active = false, mobile = false, type }) {
  const className = active ? (mobile ? 'text-slate-950' : 'text-white') : 'text-slate-500';

  if (type === 'chat') {
    return (
      <svg className={className} fill="none" height="22" viewBox="0 0 24 24" width="22">
        <path
          d="M7 17.5L4 20V6.75C4 5.784 4.784 5 5.75 5H18.25C19.216 5 20 5.784 20 6.75V15.25C20 16.216 19.216 17 18.25 17H7Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (type === 'status') {
    return (
      <svg className={className} fill="none" height="22" viewBox="0 0 24 24" width="22">
        <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeDasharray="3.4 2.6" strokeWidth="1.8" />
        <circle cx="12" cy="12" fill="currentColor" r="1.75" />
      </svg>
    );
  }

  if (type === 'call') {
    return (
      <svg className={className} fill="none" height="22" viewBox="0 0 24 24" width="22">
        <path
          d="M7.2 4.75L10.1 7.15C10.52 7.5 10.67 8.08 10.48 8.59L9.63 10.79C10.44 12.39 11.72 13.63 13.3 14.4L15.47 13.5C15.98 13.29 16.58 13.41 16.95 13.82L19.4 16.62C19.84 17.12 19.87 17.87 19.47 18.4C18.8 19.29 17.75 19.8 16.64 19.8C10.5 19.8 5.52 14.82 5.52 8.68C5.52 7.55 6.05 6.5 6.96 5.82C7.49 5.43 8.24 5.46 8.72 5.88"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg className={className} fill="none" height="22" viewBox="0 0 24 24" width="22">
      <path
        d="M12 3.75L13.52 5.35L15.7 5.13L16.49 7.18L18.55 7.97L18.33 10.15L19.93 11.67L18.33 13.19L18.55 15.37L16.49 16.16L15.7 18.21L13.52 17.99L12 19.59L10.48 17.99L8.3 18.21L7.51 16.16L5.45 15.37L5.67 13.19L4.07 11.67L5.67 10.15L5.45 7.97L7.51 7.18L8.3 5.13L10.48 5.35L12 3.75Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="11.67" fill="currentColor" r="2.1" />
    </svg>
  );
}

function TopAction({ children }) {
  return (
    <button
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/90 transition hover:bg-white/18"
      type="button"
    >
      {children}
    </button>
  );
}

function NavItem({ active, href, icon, label, mobile = false }) {
  return (
    <Link
      className={`group flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition ${
        active
          ? mobile
            ? 'bg-[rgba(var(--brand-rgb),0.18)] text-slate-950'
            : 'brand-gradient text-white shadow-lg shadow-sky-200'
          : 'text-slate-600 hover:bg-sky-50 hover:text-slate-950'
      }`}
      href={href}
    >
      <Icon active={active} mobile={mobile} type={icon} />
      <span>{label}</span>
    </Link>
  );
}

export default function UserAppShell({
  children,
  currentPath,
  currentUser,
  headerSubtitle,
  headerTitle
}) {
  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="app-grid">
        <div className="overflow-hidden rounded-[34px] border border-white/70 bg-white/65 shadow-[0_30px_90px_rgba(14,116,144,0.14)] backdrop-blur-xl">
          <header className="brand-gradient px-5 py-5 text-white sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar
                  className="h-14 w-14 border-2 border-white/45 shadow-lg"
                  label={currentUser?.mobileNumber || 'You'}
                  src={currentUser?.profilePic}
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                    DM to Kasi
                  </p>
                  <h1 className="truncate text-2xl font-semibold sm:text-3xl">{headerTitle}</h1>
                  <p className="mt-1 truncate text-sm text-white/75">{headerSubtitle}</p>
                </div>
              </div>

              <div className="hidden items-center gap-2 sm:flex">
                <TopAction>
                  <svg fill="none" height="18" viewBox="0 0 24 24" width="18">
                    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M16 16L20 20" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                  </svg>
                </TopAction>
                <TopAction>
                  <svg fill="currentColor" height="18" viewBox="0 0 24 24" width="18">
                    <circle cx="12" cy="5" r="1.8" />
                    <circle cx="12" cy="12" r="1.8" />
                    <circle cx="12" cy="19" r="1.8" />
                  </svg>
                </TopAction>
              </div>
            </div>

            <nav className="mt-5 hidden gap-3 sm:flex">
              {NAV_ITEMS.map((item) => (
                <NavItem
                  active={currentPath === item.href}
                  href={item.href}
                  icon={item.icon}
                  key={item.href}
                  label={item.label}
                />
              ))}
            </nav>
          </header>

          <div className="px-4 pb-24 pt-4 sm:px-6 sm:pb-6 sm:pt-5">{children}</div>
        </div>
      </div>

      <nav className="fixed inset-x-4 bottom-4 z-30 sm:hidden">
        <div className="glass-panel grid grid-cols-4 rounded-[28px] p-2">
          {NAV_ITEMS.map((item) => (
            <NavItem
              active={currentPath === item.href}
              href={item.href}
              icon={item.icon}
              key={item.href}
              label={item.label}
              mobile
            />
          ))}
        </div>
      </nav>
    </main>
  );
}
