'use client';

import CallLogRow from '@/components/CallLogRow';
import LoadingScreen from '@/components/LoadingScreen';
import PanelCard from '@/components/PanelCard';
import UserAppShell from '@/components/UserAppShell';
import { useUserAppPage } from '@/hooks/useUserAppPage';

const CALLS = [
  {
    label: 'Kasi',
    time: 'Today, 8:40 PM',
    type: 'voice'
  },
  {
    label: 'Kasi',
    time: 'Today, 6:18 PM',
    type: 'video'
  },
  {
    label: 'Family circle',
    time: 'Yesterday, 9:12 PM',
    type: 'voice',
    missed: true
  },
  {
    label: 'Creative room',
    time: 'Yesterday, 5:05 PM',
    type: 'video'
  }
];

export default function CallsPage() {
  const { currentUser, isLoading } = useUserAppPage();

  if (isLoading) {
    return <LoadingScreen label="Opening recent calls..." />;
  }

  return (
    <UserAppShell
      currentPath="/calls"
      currentUser={currentUser}
      headerSubtitle="Keep a WhatsApp-style view of voice and video activity."
      headerTitle="Calls"
    >
      <div className="grid gap-4 xl:grid-cols-[320px,1fr]">
        <PanelCard className="overflow-hidden">
          <div className="border-b border-white/70 p-5">
            <p className="text-sm font-semibold text-slate-900">Start a call</p>
            <p className="mt-1 text-sm text-slate-500">
              Quick actions designed like a familiar calling hub.
            </p>
          </div>

          <div className="grid gap-3 p-5">
            <button className="brand-gradient rounded-[28px] px-5 py-4 text-left text-white" type="button">
              <p className="text-base font-semibold">Voice call Kasi</p>
              <p className="mt-1 text-sm text-white/75">Fast one-tap audio style entry point.</p>
            </button>

            <button
              className="rounded-[28px] border border-sky-100 bg-white/85 px-5 py-4 text-left transition hover:bg-white"
              type="button"
            >
              <p className="text-base font-semibold text-slate-900">Video room</p>
              <p className="mt-1 text-sm text-slate-500">
                Designed as a clean preview card, ready for a real call flow later.
              </p>
            </button>

            <div className="rounded-[28px] border border-sky-100 bg-sky-50/70 p-4">
              <p className="text-sm font-semibold text-slate-900">Today at a glance</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white px-4 py-3">
                  <p className="text-2xl font-semibold text-slate-950">4</p>
                  <p className="mt-1 text-xs text-slate-500">Completed</p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3">
                  <p className="text-2xl font-semibold text-slate-950">1</p>
                  <p className="mt-1 text-xs text-slate-500">Missed</p>
                </div>
              </div>
            </div>
          </div>
        </PanelCard>

        <PanelCard className="overflow-hidden">
          <div className="border-b border-white/70 p-5">
            <p className="text-sm font-semibold text-slate-900">Recent</p>
            <p className="mt-1 text-sm text-slate-500">Voice and video history in a WhatsApp-like list.</p>
          </div>

          <div className="space-y-3 p-5">
            {CALLS.map((call) => (
              <CallLogRow
                image=""
                key={`${call.label}-${call.time}`}
                label={call.label}
                missed={call.missed}
                time={call.time}
                type={call.type}
              />
            ))}
          </div>
        </PanelCard>
      </div>
    </UserAppShell>
  );
}
