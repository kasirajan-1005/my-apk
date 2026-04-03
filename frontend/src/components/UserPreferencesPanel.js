import Avatar from '@/components/Avatar';
import ImageUploadField from '@/components/ImageUploadField';
import PanelCard from '@/components/PanelCard';

export default function UserPreferencesPanel({
  busy,
  className = '',
  currentUser,
  effectiveWallpaper,
  onLogout,
  onProfileSelect,
  onWallpaperReset,
  onWallpaperSelect,
  themeColor
}) {
  return (
    <PanelCard className={`overflow-hidden ${className}`.trim()}>
      <div className="border-b border-white/70 p-6">
        <div className="flex items-center gap-4">
          <Avatar
            className="h-16 w-16"
            label={currentUser?.mobileNumber}
            src={currentUser?.profilePic}
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
              Profile & appearance
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">
              {currentUser?.mobileNumber}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Tune the look of your personal DM and keep your profile fresh.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-6">
        <ImageUploadField
          buttonLabel="Profile picture"
          caption="Upload a square selfie or avatar to personalize your chat. JPG, PNG, WEBP, GIF, SVG, HEIC, and more are supported."
          disabled={busy}
          onSelect={onProfileSelect}
        />

        <ImageUploadField
          buttonLabel="Chat wallpaper"
          caption="Choose a personal wallpaper in almost any common image format. If you clear it, the admin default takes over."
          disabled={busy}
          onSelect={onWallpaperSelect}
        />

        <div className="rounded-3xl border border-sky-100 bg-white/80 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Current app theme</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Pulled from the live admin settings so your chat keeps the latest look.
              </p>
            </div>
            <div
              className="h-10 w-10 rounded-full border-4 border-white shadow-lg"
              style={{ backgroundColor: themeColor }}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-sky-100 bg-white/80 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Wallpaper source</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {effectiveWallpaper
                  ? 'An image is active for this chat thread.'
                  : 'The chat is currently using the built-in airy gradient.'}
              </p>
            </div>
            <button
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              disabled={busy}
              onClick={onWallpaperReset}
              type="button"
            >
              Reset
            </button>
          </div>
        </div>

        <button
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          onClick={onLogout}
          type="button"
        >
          Logout
        </button>
      </div>
    </PanelCard>
  );
}
