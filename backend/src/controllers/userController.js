import User from '../models/User.js';
import { serializeUser } from '../utils/serializers.js';

const MAX_IMAGE_LENGTH = 5_000_000;

function validateImageValue(value, fieldName) {
  const normalizedValue = typeof value === 'string' ? value.trim() : '';

  if (!normalizedValue) {
    return '';
  }

  if (!normalizedValue.startsWith('data:image/')) {
    throw new Error(`${fieldName} must be a valid image data URL.`);
  }

  if (normalizedValue.length > MAX_IMAGE_LENGTH) {
    throw new Error(`${fieldName} is too large. Please choose an image under 5 MB.`);
  }

  return normalizedValue;
}

export async function updateProfilePicture(req, res) {
  try {
    const profilePic = validateImageValue(req.body.profilePic, 'Profile picture');

    const user = await User.findOneAndUpdate(
      { mobileNumber: req.auth.mobileNumber },
      { profilePic },
      { new: true }
    ).lean();

    if (!user) {
      return res.status(404).json({
        message: 'User account not found.'
      });
    }

    const serializedUser = serializeUser(user);
    req.io.to(`thread:${req.auth.mobileNumber}`).emit('profile:update', serializedUser);
    req.io.to('admins').emit('profile:update', serializedUser);

    return res.json({
      user: serializedUser
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
}

export async function updateOwnWallpaper(req, res) {
  try {
    const wallpaper =
      req.body.wallpaper === null ? '' : validateImageValue(req.body.wallpaper, 'Wallpaper');

    const user = await User.findOneAndUpdate(
      { mobileNumber: req.auth.mobileNumber },
      { wallpaper },
      { new: true }
    ).lean();

    if (!user) {
      return res.status(404).json({
        message: 'User account not found.'
      });
    }

    const serializedUser = serializeUser(user);
    req.io.to(`thread:${req.auth.mobileNumber}`).emit('profile:update', serializedUser);
    req.io.to('admins').emit('profile:update', serializedUser);

    return res.json({
      user: serializedUser
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
}
