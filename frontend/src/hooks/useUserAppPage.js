'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRealtimeEvents } from '@/hooks/useRealtimeEvents';

export function useUserAppPage() {
  const router = useRouter();
  const { currentUser, isReady, logout, role, token, updateCurrentUser } = useAuth();
  const { mergeSettings, settings } = useTheme();

  useEffect(() => {
    if (isReady && (!token || role !== 'user')) {
      router.replace('/');
    }
  }, [isReady, role, router, token]);

  useRealtimeEvents({
    token: role === 'user' ? token : '',
    onSettingsUpdate(nextSettings) {
      mergeSettings(nextSettings);
    },
    onProfileUpdate(updatedUser) {
      if (updatedUser.mobileNumber === currentUser?.mobileNumber) {
        updateCurrentUser(updatedUser);
      }
    }
  });

  return {
    currentUser,
    isLoading: !isReady || (token && role === 'user' && !currentUser),
    isReady,
    logoutToHome() {
      logout();
      router.replace('/');
    },
    role,
    settings,
    token,
    updateCurrentUser
  };
}
