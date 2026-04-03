import AdminSetting from '../models/AdminSetting.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { isValidMobileNumber, normalizeMobileNumber } from '../utils/mobile.js';
import { serializeUser } from '../utils/serializers.js';
import { ensureAdminSettings, serializeSettings } from '../utils/settings.js';

const HEX_COLOR_PATTERN = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
const MAX_IMAGE_LENGTH = 5_000_000;

function getAdminMobileNumber() {
  return normalizeMobileNumber(process.env.ADMIN_MOBILE_NUMBER);
}

function validateColor(value) {
  if (!HEX_COLOR_PATTERN.test(String(value || '').trim())) {
    throw new Error('Theme color must be a valid hex color like #38bdf8.');
  }

  return String(value).trim();
}

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

export async function getPublicSettings(req, res) {
  const settings = await ensureAdminSettings();

  return res.json({
    settings: serializeSettings(settings)
  });
}

export async function getAdminSettings(req, res) {
  const settings = await ensureAdminSettings();

  return res.json({
    settings: serializeSettings(settings)
  });
}

export async function updateAdminSettings(req, res) {
  try {
    const updates = {};

    if (req.body.themeColor !== undefined) {
      updates.themeColor = validateColor(req.body.themeColor);
    }

    if (req.body.globalWallpaper !== undefined) {
      updates.globalWallpaper =
        req.body.globalWallpaper === null
          ? ''
          : validateImageValue(req.body.globalWallpaper, 'Global wallpaper');
    }

    const settings = await AdminSetting.findOneAndUpdate(
      {},
      { $set: updates },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    const serializedSettings = serializeSettings(settings);
    req.io.emit('settings:update', serializedSettings);

    return res.json({
      settings: serializedSettings
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
}

export async function getChats(req, res) {
  const adminMobileNumber = getAdminMobileNumber();
  const users = await User.find().sort({ updatedAt: -1, createdAt: -1 }).lean();
  const latestMessages = await Message.aggregate([
    {
      $project: {
        sender: 1,
        receiver: 1,
        message: 1,
        timestamp: 1,
        userMobile: {
          $cond: [{ $eq: ['$sender', adminMobileNumber] }, '$receiver', '$sender']
        }
      }
    },
    { $sort: { timestamp: -1 } },
    {
      $group: {
        _id: '$userMobile',
        lastMessage: { $first: '$message' },
        lastTimestamp: { $first: '$timestamp' },
        lastSender: { $first: '$sender' }
      }
    }
  ]);

  const latestMessageMap = new Map(
    latestMessages.map((message) => [
      message._id,
      {
        lastMessage: message.lastMessage,
        lastTimestamp: message.lastTimestamp,
        lastSender: message.lastSender
      }
    ])
  );

  const chats = users
    .map((user) => {
      const lastEntry = latestMessageMap.get(user.mobileNumber);

      return {
        ...serializeUser(user),
        lastMessage: lastEntry?.lastMessage || '',
        lastTimestamp: lastEntry?.lastTimestamp || null,
        lastSender: lastEntry?.lastSender || '',
        hasMessages: Boolean(lastEntry)
      };
    })
    .sort((first, second) => {
      const firstTimestamp = first.lastTimestamp ? new Date(first.lastTimestamp).getTime() : 0;
      const secondTimestamp = second.lastTimestamp ? new Date(second.lastTimestamp).getTime() : 0;

      if (secondTimestamp !== firstTimestamp) {
        return secondTimestamp - firstTimestamp;
      }

      return second.mobileNumber.localeCompare(first.mobileNumber);
    });

  return res.json({
    chats
  });
}

export async function overrideUserWallpaper(req, res) {
  const mobileNumber = normalizeMobileNumber(req.params.mobileNumber);

  if (!isValidMobileNumber(mobileNumber) || mobileNumber === getAdminMobileNumber()) {
    return res.status(400).json({
      message: 'Please choose a valid user mobile number.'
    });
  }

  try {
    const wallpaper =
      req.body.wallpaper === null ? '' : validateImageValue(req.body.wallpaper, 'Wallpaper');

    const user = await User.findOneAndUpdate(
      { mobileNumber },
      { wallpaper },
      { new: true }
    ).lean();

    if (!user) {
      return res.status(404).json({
        message: 'User account not found.'
      });
    }

    const serializedUser = serializeUser(user);
    req.io.to(`thread:${mobileNumber}`).emit('profile:update', serializedUser);
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
