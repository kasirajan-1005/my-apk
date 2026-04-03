import AdminSetting from '../models/AdminSetting.js';

export async function ensureAdminSettings() {
  const existingSettings = await AdminSetting.findOne();

  if (existingSettings) {
    return existingSettings;
  }

  return AdminSetting.create({});
}

export function serializeSettings(settings) {
  return {
    globalWallpaper: settings?.globalWallpaper || '',
    themeColor: settings?.themeColor || '#38bdf8'
  };
}
