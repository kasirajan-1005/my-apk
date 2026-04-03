import Avatar from '@/components/Avatar';
import ImageUploadField from '@/components/ImageUploadField';
import PanelCard from '@/components/PanelCard';

export default function AdminSettingsPanel({
  busy,
  onGlobalWallpaperReset,
  onGlobalWallpaperSelect,
  onLogout,
  onThemeDraftChange,
  onThemeSave,
  onUserWallpaperReset,
  onUserWallpaperSelect,
  selectedChat,
  settings,
  themeDraft
}) {
  return (
    <PanelCard className="overflow-hidden">
      <div className="border-b border-white/70 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
          Control room
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">Admin settings</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Broadcast a fresh look across the app or fine-tune the currently selected user thread.
        </p>
      </div>

      <div className="space-y-5 p-6">
        <div className="rounded-[28px] border border-sky-100 bg-white/80 p-4">
          <p className="text-sm font-semibold text-slate-900">Theme color</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            This updates the accent used across login, chat bubbles, and cards.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <input
              className="h-12 w-16 cursor-pointer rounded-2xl border border-sky-100 bg-white p-2"
              onChange={(event) => onThemeDraftChange(event.target.value)}
              type="color"
              value={themeDraft}
            />
            <input
              className="flex-1 rounded-2xl border border-sky-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              onChange={(event) => onThemeDraftChange(event.target.value)}
              value={themeDraft}
            />
          </div>

          <button
            className="mt-4 w-full rounded-2xl brand-gradient px-4 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={busy}
            onClick={onThemeSave}
            type="button"
          >
            Save theme
          </button>
        </div>

        <ImageUploadField
          buttonLabel="Global wallpaper"
          caption="Set the default background every user sees unless a personal wallpaper overrides it. Common image formats are supported."
          disabled={busy}
          onSelect={onGlobalWallpaperSelect}
        />

        <button
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          disabled={busy}
          onClick={onGlobalWallpaperReset}
          type="button"
        >
          Clear global wallpaper
        </button>

        <div className="rounded-[28px] border border-sky-100 bg-white/80 p-4">
          <p className="text-sm font-semibold text-slate-900">Selected user override</p>
          {selectedChat ? (
            <div className="mt-4">
              <div className="flex items-center gap-3 rounded-3xl border border-sky-100 bg-sky-50/65 p-3">
                <Avatar
                  className="h-12 w-12"
                  label={selectedChat.mobileNumber}
                  src={selectedChat.profilePic}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {selectedChat.mobileNumber}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {selectedChat.wallpaper
                      ? 'This user currently has a custom wallpaper.'
                      : settings.globalWallpaper
                        ? 'Using the global wallpaper.'
                        : 'Using the default gradient background.'}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <ImageUploadField
                  buttonLabel="User wallpaper"
                  caption="Override this user with a custom background image in any common format."
                  disabled={busy}
                  onSelect={onUserWallpaperSelect}
                />

                <button
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  disabled={busy}
                  onClick={onUserWallpaperReset}
                  type="button"
                >
                  Remove user override
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Pick a user from the inbox to manage their wallpaper.
            </p>
          )}
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
