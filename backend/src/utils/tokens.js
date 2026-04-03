import jwt from 'jsonwebtoken';

export function signAuthToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

export function verifyAuthToken(token) {
  if (!token) {
    throw new Error('Missing token');
  }

  return jwt.verify(token, process.env.JWT_SECRET);
}
