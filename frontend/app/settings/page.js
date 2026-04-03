'use client';

import { useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import PanelCard from '@/components/PanelCard';
import SettingsLinkCard from '@/components/SettingsLinkCard';
import UserAppShell from '@/components/UserAppShell';
import UserPreferencesPanel from '@/components/UserPreferencesPanel';
import { useUserAppPage } from '@/hooks/useUserAppPage';
import { apiRequest } from '@/lib/api';
import { readImageAsDataUrl } from '@/lib/media';

function SettingsIcon({ type }) {
  if (type === 'privacy') {
    return (
      <svg fill="none" height="20" viewBox="0 0 24 24" width="20">
        <path
          d="M12 4L18 6.5V11.7C18 15.2 15.86 18.38 12 20C8.14 18.38 6 15.2 6 11.7V6.5L12 4Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (type === 'notification') {
    return (
      <svg fill="none" height="20" viewBox="0 0 24 24" width="20">
        <path
          d="M8 17H16L15 15.4V11.3C15 9.54 13.66 8.05 12 8.05C10.34 8.05 9 9.54 9 11.3V15.4L8 17Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path d="M10.5 18.75C10.82 19.4 11.36 19.75 12 19.75C12.64 19.75 13.18 19.4 13.5 18.75" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (type === 'storage') {
    return (
      <svg fill="none" height="20" viewBox="0 0 24 24" width="20">
        <path
          d="M5.75 6.75C5.75 5.78 6.53 5 7.5 5H16.5C17.47 5 18.25 5.78 18.25 6.75V17.25C18.25 18.22 17.47 19 16.5 19H7.5C6.53 19 5.75 18.22 5.75 17.25V6.75Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path d="M9 9H15M9 12H15M9 15H13" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    );
  }

  return (
    <svg fill="none" height="20" viewBox="0 0 24 24" width="20">
      <path
        d="M12 5V12L16 14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export default function SettingsPage() {
  const { currentUser, isLoading, logoutToHome, settings, token, updateCurrentUser } = useUserAppPage();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function updateProfilePicture(file) {
    setBusy(true);
    setError('');

    try {
      const profilePic = await readImageAsDataUrl(file);
      const response = await apiRequest('/users/me/profile', {
        method: 'PUT',
        token,
        body: {
          profilePic
        }
      });

      updateCurrentUser(response.user);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function updateWallpaper(file) {
    setBusy(true);
    setError('');

    try {
      const wallpaper = await readImageAsDataUrl(file);
      const response = await apiRequest('/users/me/wallpaper', {
        method: 'PUT',
        token,
        body: {
          wallpaper
        }
      });

      updateCurrentUser(response.user);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function resetWallpaper() {
    setBusy(true);
    setError('');

    try {
      const response = await apiRequest('/users/me/wallpaper', {
        method: 'PUT',
        token,
        body: {
          wallpaper: null
        }
      });

      updateCurrentUser(response.user);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  if (isLoading) {
    return <LoadingScreen label="Opening settings..." />;
  }

  const wallpaper = currentUser?.wallpaper || settings.globalWallpaper;

  return (
    <UserAppShell
      currentPath="/settings"
      currentUser={currentUser}
      headerSubtitle="Profile, wallpaper, theme cues, and familiar settings sections."
      headerTitle="Settings"
    >
      {error ? (
        <div className="mb-4 rounded-3xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[380px,1fr]">
        <UserPreferencesPanel
          busy={busy}
          className="h-fit"
          currentUser={currentUser}
          effectiveWallpaper={wallpaper}
          onLogout={logoutToHome}
          onProfileSelect={updateProfilePicture}
          onWallpaperReset={resetWallpaper}
          onWallpaperSelect={updateWallpaper}
          themeColor={settings.themeColor}
        />

        <div className="space-y-4">
          <PanelCard className="overflow-hidden">
            <div className="border-b border-white/70 p-5">
              <p className="text-sm font-semibold text-slate-900">Core settings</p>
              <p className="mt-1 text-sm text-slate-500">
                Familiar categories, shaped to match the new WhatsApp-style app shell.
              </p>
            </div>

            <div className="space-y-3 p-5">
              <SettingsLinkCard
                icon={<SettingsIcon type="privacy" />}
                label="Privacy"
                subtitle="Control profile visibility and personal presence."
              />
              <SettingsLinkCard
                icon={<SettingsIcon type="notification" />}
                label="Notifications"
                subtitle="Sounds, popups, and alert preferences."
              />
              <SettingsLinkCard
                icon={<SettingsIcon type="storage" />}
                label="Storage & data"
                subtitle="Manage media-heavy chats and wallpaper usage."
              />
              <SettingsLinkCard
                icon={<SettingsIcon type="time" />}
                label="App behavior"
                subtitle="Small visual and chat experience preferences."
              />
            </div>
          </PanelCard>

          <PanelCard className="overflow-hidden">
            <div className="border-b border-white/70 p-5">
              <p className="text-sm font-semibold text-slate-900">Live appearance</p>
              <p className="mt-1 text-sm text-slate-500">
                This section reacts to the current admin theme and your selected wallpaper.
              </p>
            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-3">
              <div className="rounded-[24px] border border-sky-100 bg-white/90 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Theme</p>
                <div
                  className="mt-4 h-12 w-12 rounded-full border-4 border-white shadow-lg"
                  style={{ backgroundColor: settings.themeColor }}
                />
                <p className="mt-3 text-sm font-medium text-slate-900">{settings.themeColor}</p>
              </div>

              <div className="rounded-[24px] border border-sky-100 bg-white/90 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Wallpaper</p>
                <div className="mt-4 h-20 rounded-2xl border border-sky-100 bg-sky-50" style={wallpaper ? { backgroundImage: `url("${wallpaper}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}} />
                <p className="mt-3 text-sm font-medium text-slate-900">
                  {wallpaper ? 'Active image' : 'Default gradient'}
                </p>
              </div>

              <div className="rounded-[24px] border border-sky-100 bg-white/90 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Profile</p>
                <p className="mt-4 text-2xl font-semibold text-slate-950">
                  {currentUser?.mobileNumber?.slice(-4) || '0000'}
                </p>
                <p className="mt-3 text-sm font-medium text-slate-900">Quick identity badge</p>
              </div>
            </div>
          </PanelCard>
        </div>
      </div>
    </UserAppShell>
  );
}
