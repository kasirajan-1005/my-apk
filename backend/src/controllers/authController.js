import User from '../models/User.js';
import { normalizeMobileNumber, isValidMobileNumber } from '../utils/mobile.js';
import { serializeUser } from '../utils/serializers.js';
import { ensureAdminSettings } from '../utils/settings.js';
import { signAuthToken } from '../utils/tokens.js';

function buildAdminPayload(mobileNumber) {
  return {
    mobileNumber,
    profilePic: '',
    wallpaper: '',
    isAdmin: true
  };
}

export async function login(req, res) {
  const mobileNumber = normalizeMobileNumber(req.body.mobileNumber);
  const pin = String(req.body.pin || '').trim();

  if (!isValidMobileNumber(mobileNumber)) {
    return res.status(400).json({
      message: 'Please enter a valid 10-digit mobile number.'
    });
  }

  const adminMobileNumber = normalizeMobileNumber(process.env.ADMIN_MOBILE_NUMBER);
  const isAdmin = mobileNumber === adminMobileNumber;

  if (isAdmin && pin !== String(process.env.ADMIN_PIN)) {
    return res.status(401).json({
      message: 'Admin PIN is incorrect.'
    });
  }

  await ensureAdminSettings();

  if (isAdmin) {
    return res.json({
      token: signAuthToken({ mobileNumber, role: 'admin' }),
      role: 'admin',
      user: buildAdminPayload(mobileNumber)
    });
  }

  const user = await User.findOneAndUpdate(
    { mobileNumber },
    {
      $setOnInsert: {
        mobileNumber
      }
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  ).lean();

  return res.json({
    token: signAuthToken({ mobileNumber, role: 'user' }),
    role: 'user',
    user: serializeUser(user)
  });
}

export async function getCurrentSession(req, res) {
  if (req.auth.role === 'admin') {
    return res.json({
      role: 'admin',
      user: buildAdminPayload(req.auth.mobileNumber)
    });
  }

  const user = await User.findOne({ mobileNumber: req.auth.mobileNumber }).lean();

  if (!user) {
    return res.status(404).json({
      message: 'User account not found.'
    });
  }

  return res.json({
    role: 'user',
    user: serializeUser(user)
  });
}
