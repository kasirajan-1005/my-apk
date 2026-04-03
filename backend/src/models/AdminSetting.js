import mongoose from 'mongoose';

const adminSettingSchema = new mongoose.Schema(
  {
    globalWallpaper: {
      type: String,
      default: ''
    },
    themeColor: {
      type: String,
      default: '#38bdf8'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('AdminSetting', adminSettingSchema);
