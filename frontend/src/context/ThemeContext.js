'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '@/lib/api';

const ThemeContext = createContext(null);
const HEX_COLOR_PATTERN = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

function hexToRgbString(hexColor) {
  const sanitized = hexColor.replace('#', '');
  const expanded =
    sanitized.length === 3
      ? sanitized
          .split('')
          .map((character) => character + character)
          .join('')
      : sanitized;

  const numericValue = Number.parseInt(expanded, 16);
  const red = (numericValue >> 16) & 255;
  const green = (numericValue >> 8) & 255;
  const blue = numericValue & 255;

  return `${red} ${green} ${blue}`;
}

function mixColor(hexColor, amount) {
  const sanitized = hexColor.replace('#', '');
  const expanded =
    sanitized.length === 3
      ? sanitized
          .split('')
          .map((character) => character + character)
          .join('')
      : sanitized;

  const numericValue = Number.parseInt(expanded, 16);
  const red = Math.max(0, Math.min(255, ((numericValue >> 16) & 255) + amount));
  const green = Math.max(0, Math.min(255, ((numericValue >> 8) & 255) + amount));
  const blue = Math.max(0, Math.min(255, (numericValue & 255) + amount));

  return `#${[red, green, blue]
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')}`;
}

function applyTheme(settings) {
  if (typeof document === 'undefined') {
    return;
  }

  const brand = HEX_COLOR_PATTERN.test(settings.themeColor || '')
    ? settings.themeColor
    : '#38bdf8';
  const root = document.documentElement;

  root.style.setProperty('--brand', brand);
  root.style.setProperty('--brand-deep', mixColor(brand, -36));
  root.style.setProperty('--brand-soft', mixColor(brand, 96));
  root.style.setProperty('--brand-rgb', hexToRgbString(brand));
}

export function ThemeProvider({ children }) {
  const [settings, setSettings] = useState({
    globalWallpaper: '',
    themeColor: '#38bdf8'
  });

  useEffect(() => {
    applyTheme(settings);
  }, [settings]);

  useEffect(() => {
    let ignore = false;

    async function loadSettings() {
      try {
        const response = await apiRequest('/admin/settings/public');

        if (!ignore) {
          setSettings(response.settings);
        }
      } catch (error) {
        if (!ignore) {
          setSettings({
            globalWallpaper: '',
            themeColor: '#38bdf8'
          });
        }
      }
    }

    loadSettings();

    return () => {
      ignore = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      settings,
      setSettings,
      mergeSettings(partialSettings) {
        setSettings((previousSettings) => ({
          ...previousSettings,
          ...partialSettings,
          themeColor: HEX_COLOR_PATTERN.test(partialSettings.themeColor || '')
            ? partialSettings.themeColor
            : previousSettings.themeColor
        }));
      },
      async refreshSettings() {
        const response = await apiRequest('/admin/settings/public');
        setSettings(response.settings);
        return response.settings;
      }
    }),
    [settings]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider.');
  }

  return context;
}
