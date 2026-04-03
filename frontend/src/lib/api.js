const FALLBACK_API_URL = 'http://localhost:5000/api';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || FALLBACK_API_URL;
export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  API_URL.replace(/\/api\/?$/, '') ||
  'http://localhost:5000';

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});

  if (options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: 'no-store'
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
}
