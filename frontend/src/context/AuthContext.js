'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '@/lib/api';

const STORAGE_KEY = 'dm-to-kasi-session';
const AuthContext = createContext(null);

function persistSession(session) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!session?.token) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    isReady: false,
    token: '',
    role: '',
    currentUser: null
  });

  useEffect(() => {
    let ignore = false;

    async function restoreSession() {
      if (typeof window === 'undefined') {
        return;
      }

      const storedSession = window.localStorage.getItem(STORAGE_KEY);

      if (!storedSession) {
        if (!ignore) {
          setState((previousState) => ({
            ...previousState,
            isReady: true
          }));
        }

        return;
      }

      try {
        const parsedSession = JSON.parse(storedSession);

        if (!parsedSession?.token) {
          throw new Error('Session token is missing.');
        }

        const sessionData = await apiRequest('/auth/me', {
          token: parsedSession.token
        });
        const nextSession = {
          token: parsedSession.token,
          role: sessionData.role,
          user: sessionData.user
        };

        persistSession(nextSession);

        if (!ignore) {
          setState({
            isReady: true,
            token: nextSession.token,
            role: nextSession.role,
            currentUser: nextSession.user
          });
        }
      } catch (error) {
        persistSession(null);

        if (!ignore) {
          setState({
            isReady: true,
            token: '',
            role: '',
            currentUser: null
          });
        }
      }
    }

    restoreSession();

    return () => {
      ignore = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      isAuthenticated: Boolean(state.token),
      loginSession(session) {
        const nextSession = {
          token: session.token,
          role: session.role,
          user: session.user
        };

        persistSession(nextSession);
        setState({
          isReady: true,
          token: nextSession.token,
          role: nextSession.role,
          currentUser: nextSession.user
        });
      },
      updateCurrentUser(user) {
        setState((previousState) => {
          const nextState = {
            ...previousState,
            currentUser: user
          };

          persistSession({
            token: nextState.token,
            role: nextState.role,
            user
          });

          return nextState;
        });
      },
      logout() {
        persistSession(null);
        setState({
          isReady: true,
          token: '',
          role: '',
          currentUser: null
        });
      }
    }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
}
