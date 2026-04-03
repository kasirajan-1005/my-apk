'use client';

import { useEffect, useRef } from 'react';
import { createSocket } from '@/lib/socket';

export function useRealtimeEvents({
  token,
  onMessage,
  onConversationUpdate,
  onSettingsUpdate,
  onProfileUpdate
}) {
  const handlersRef = useRef({
    onMessage,
    onConversationUpdate,
    onSettingsUpdate,
    onProfileUpdate
  });

  useEffect(() => {
    handlersRef.current = {
      onMessage,
      onConversationUpdate,
      onSettingsUpdate,
      onProfileUpdate
    };
  }, [onConversationUpdate, onMessage, onProfileUpdate, onSettingsUpdate]);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    const socket = createSocket(token);

    socket.on('message:new', (payload) => {
      handlersRef.current.onMessage?.(payload);
    });

    socket.on('conversation:update', (payload) => {
      handlersRef.current.onConversationUpdate?.(payload);
    });

    socket.on('settings:update', (payload) => {
      handlersRef.current.onSettingsUpdate?.(payload);
    });

    socket.on('profile:update', (payload) => {
      handlersRef.current.onProfileUpdate?.(payload);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);
}
