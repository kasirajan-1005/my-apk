'use client';

import LoadingScreen from '@/components/LoadingScreen';
import PanelCard from '@/components/PanelCard';
import StatusRing from '@/components/StatusRing';
import UserAppShell from '@/components/UserAppShell';
import { useUserAppPage } from '@/hooks/useUserAppPage';

function buildStatusSections(currentUser) {
  return {
    mine: {
      image: currentUser?.profilePic || '',
      label: 'My status',
      subtitle: 'Tap to share a quick update'
    },
    recent: [
      {
        image: '',
        label: 'Kasi',
        subtitle: 'Just now'
      },
      {
        image: '',
        label: 'Family circle',
        subtitle: 'Today, 6:20 PM'
      },
      {
        image: '',
        label: 'Studio notes',
        subtitle: 'Today, 4:05 PM'
      }
    ],
    viewed: [
      {
        image: '',
        label: 'Close friends',
        subtitle: 'Today, 1:45 PM'
      },
      {
        image: '',
        label: 'Weekend plans',
        subtitle: 'Yesterday, 10:12 PM'
      }
    ]
  };
}

export default function StatusPage() {
  const { currentUser, isLoading } = useUserAppPage();

  if (isLoading) {
    return <LoadingScreen label="Opening status updates..." />;
  }

  const sections = buildStatusSections(currentUser);

  return (
    <UserAppShell
      currentPath="/status"
      currentUser={currentUser}
      headerSubtitle="Story-style updates, just like WhatsApp, but in your sky-blue theme."
      headerTitle="Status"
    >
      <div className="grid gap-4 xl:grid-cols-[360px,1fr]">
        <PanelCard className="overflow-hidden">
          <div className="border-b border-white/70 p-5">
            <p className="text-sm font-semibold text-slate-900">My status</p>
            <p className="mt-1 text-sm text-slate-500">
              Share a photo, a vibe, or a quick note when you want your circle to notice.
            </p>
          </div>

          <div className="space-y-4 p-5">
            <StatusRing
              active
              image={sections.mine.image}
              label={sections.mine.label}
              subtitle={sections.mine.subtitle}
            />

            <div className="rounded-[26px] border border-sky-100 bg-sky-50/70 p-4">
              <p className="text-sm font-semibold text-slate-900">Quick ideas</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {['Morning mood', 'At work', 'Busy now', 'New wallpaper'].map((item) => (
                  <span
                    className="rounded-full border border-sky-200 bg-white px-3 py-2 text-xs font-medium text-sky-700"
                    key={item}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </PanelCard>

        <div className="space-y-4">
          <PanelCard className="overflow-hidden">
            <div className="border-b border-white/70 p-5">
              <p className="text-sm font-semibold text-slate-900">Recent updates</p>
              <p className="mt-1 text-sm text-slate-500">Fresh circles that just lit up.</p>
            </div>

            <div className="space-y-3 p-5">
              {sections.recent.map((status) => (
                <StatusRing
                  active
                  image={status.image}
                  key={status.label}
                  label={status.label}
                  subtitle={status.subtitle}
                />
              ))}
            </div>
          </PanelCard>

          <PanelCard className="overflow-hidden">
            <div className="border-b border-white/70 p-5">
              <p className="text-sm font-semibold text-slate-900">Viewed</p>
              <p className="mt-1 text-sm text-slate-500">
                Updates you already checked, kept neatly in one place.
              </p>
            </div>

            <div className="space-y-3 p-5">
              {sections.viewed.map((status) => (
                <StatusRing
                  image={status.image}
                  key={status.label}
                  label={status.label}
                  subtitle={status.subtitle}
                />
              ))}
            </div>
          </PanelCard>
        </div>
      </div>
    </UserAppShell>
  );
}
