import { io } from 'socket.io-client';
import { SOCKET_URL } from '@/lib/api';

export function createSocket(token) {
  return io(SOCKET_URL, {
    auth: {
      token
    },
    transports: ['websocket', 'polling']
  });
}
