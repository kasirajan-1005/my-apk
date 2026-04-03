import { verifyAuthToken } from '../utils/tokens.js';

function extractBearerToken(headerValue = '') {
  if (!headerValue.startsWith('Bearer ')) {
    return '';
  }

  return headerValue.slice(7);
}

export function authenticateRequest(req, res, next) {
  try {
    const token = extractBearerToken(req.headers.authorization || '');
    const payload = verifyAuthToken(token);

    req.auth = {
      mobileNumber: payload.mobileNumber,
      role: payload.role
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized request.'
    });
  }
}

export function requireAdmin(req, res, next) {
  if (req.auth?.role !== 'admin') {
    return res.status(403).json({
      message: 'Admin access is required.'
    });
  }

  next();
}
