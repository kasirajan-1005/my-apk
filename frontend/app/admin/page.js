'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSettingsPanel from '@/components/AdminSettingsPanel';
import ChatWindow from '@/components/ChatWindow';
import ConversationList from '@/components/ConversationList';
import LoadingScreen from '@/components/LoadingScreen';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRealtimeEvents } from '@/hooks/useRealtimeEvents';
import { apiRequest } from '@/lib/api';
import { upsertChat, upsertMessage } from '@/lib/chat';
import { readImageAsDataUrl } from '@/lib/media';

const HEX_COLOR_PATTERN = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

export default function AdminPage() {
  const router = useRouter();
  const { currentUser, isReady, logout, role, token } = useAuth();
  const { mergeSettings, settings } = useTheme();
  const [chats, setChats] = useState([]);
  const [selectedMobile, setSelectedMobile] = useState('');
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sending, setSending] = useState(false);
  const [themeDraft, setThemeDraft] = useState(settings.themeColor);
  const selectedMobileRef = useRef('');

  useEffect(() => {
    selectedMobileRef.current = selectedMobile;
  }, [selectedMobile]);

  useEffect(() => {
    if (isReady && (!token || role !== 'admin')) {
      router.replace('/');
    }
  }, [isReady, role, router, token]);

  useEffect(() => {
    setThemeDraft(settings.themeColor);
  }, [settings.themeColor]);

  useEffect(() => {
    let ignore = false;

    async function loadChats() {
      if (!token || role !== 'admin') {
        return;
      }

      setLoadingChats(true);
      setError('');

      try {
        const response = await apiRequest('/admin/chats', {
          token
        });
        const incomingChats = response.chats || [];

        if (ignore) {
          return;
        }

        setChats(incomingChats);
        setSelectedMobile((previousMobile) => {
          if (previousMobile && incomingChats.some((chat) => chat.mobileNumber === previousMobile)) {
            return previousMobile;
          }

          return incomingChats[0]?.mobileNumber || '';
        });
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message);
        }
      } finally {
        if (!ignore) {
          setLoadingChats(false);
        }
      }
    }

    loadChats();

    return () => {
      ignore = true;
    };
  }, [role, token]);

  useEffect(() => {
    let ignore = false;

    async function loadThread() {
      if (!token || role !== 'admin' || !selectedMobile) {
        setMessages([]);
        return;
      }

      setLoadingMessages(true);
      setError('');

      try {
        const response = await apiRequest(`/messages?withMobile=${selectedMobile}`, {
          token
        });

        if (!ignore) {
          setMessages(response.messages || []);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message);
        }
      } finally {
        if (!ignore) {
          setLoadingMessages(false);
        }
      }
    }

    loadThread();

    return () => {
      ignore = true;
    };
  }, [role, selectedMobile, token]);

  useRealtimeEvents({
    token: role === 'admin' ? token : '',
    onMessage(incomingMessage) {
      const otherMobile =
        incomingMessage.sender === currentUser?.mobileNumber
          ? incomingMessage.receiver
          : incomingMessage.sender;

      setChats((previousChats) =>
        upsertChat(previousChats, otherMobile, {
          lastMessage: incomingMessage.message,
          lastTimestamp: incomingMessage.timestamp,
          lastSender: incomingMessage.sender,
          hasMessages: true
        })
      );

      if (!selectedMobileRef.current) {
        setSelectedMobile(otherMobile);
      }

      if (selectedMobileRef.current === otherMobile) {
        setMessages((previousMessages) => upsertMessage(previousMessages, incomingMessage));
      }
    },
    onConversationUpdate(update) {
      if (!update?.userMobile || !update.lastMessage) {
        return;
      }

      setChats((previousChats) =>
        upsertChat(previousChats, update.userMobile, {
          lastMessage: update.lastMessage.message,
          lastTimestamp: update.lastMessage.timestamp,
          lastSender: update.lastMessage.sender,
          hasMessages: true
        })
      );

      if (!selectedMobileRef.current) {
        setSelectedMobile(update.userMobile);
      }
    },
    onSettingsUpdate(nextSettings) {
      mergeSettings(nextSettings);
      setThemeDraft(nextSettings.themeColor);
    },
    onProfileUpdate(updatedUser) {
      if (!updatedUser?.mobileNumber) {
        return;
      }

      setChats((previousChats) => upsertChat(previousChats, updatedUser.mobileNumber, updatedUser));
    }
  });

  async function handleSend() {
    const trimmedDraft = draft.trim();

    if (!trimmedDraft || !selectedMobile || sending) {
      return;
    }

    setSending(true);
    setError('');

    try {
      const response = await apiRequest('/messages', {
        method: 'POST',
        token,
        body: {
          receiver: selectedMobile,
          message: trimmedDraft
        }
      });

      setMessages((previousMessages) => upsertMessage(previousMessages, response.message));
      setChats((previousChats) =>
        upsertChat(previousChats, selectedMobile, {
          lastMessage: response.message.message,
          lastTimestamp: response.message.timestamp,
          lastSender: response.message.sender,
          hasMessages: true
        })
      );
      setDraft('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSending(false);
    }
  }

  async function saveThemeColor() {
    setBusy(true);
    setError('');

    try {
      const response = await apiRequest('/admin/settings', {
        method: 'PUT',
        token,
        body: {
          themeColor: themeDraft
        }
      });

      mergeSettings(response.settings);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function updateGlobalWallpaper(file) {
    setBusy(true);
    setError('');

    try {
      const globalWallpaper = await readImageAsDataUrl(file);
      const response = await apiRequest('/admin/settings', {
        method: 'PUT',
        token,
        body: {
          globalWallpaper
        }
      });

      mergeSettings(response.settings);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function clearGlobalWallpaper() {
    setBusy(true);
    setError('');

    try {
      const response = await apiRequest('/admin/settings', {
        method: 'PUT',
        token,
        body: {
          globalWallpaper: null
        }
      });

      mergeSettings(response.settings);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function updateSelectedUserWallpaper(file) {
    if (!selectedMobile) {
      return;
    }

    setBusy(true);
    setError('');

    try {
      const wallpaper = await readImageAsDataUrl(file);
      const response = await apiRequest(`/admin/users/${selectedMobile}/wallpaper`, {
        method: 'PUT',
        token,
        body: {
          wallpaper
        }
      });

      setChats((previousChats) => upsertChat(previousChats, selectedMobile, response.user));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function clearSelectedUserWallpaper() {
    if (!selectedMobile) {
      return;
    }

    setBusy(true);
    setError('');

    try {
      const response = await apiRequest(`/admin/users/${selectedMobile}/wallpaper`, {
        method: 'PUT',
        token,
        body: {
          wallpaper: null
        }
      });

      setChats((previousChats) => upsertChat(previousChats, selectedMobile, response.user));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  if (!isReady || (token && role === 'admin' && !currentUser)) {
    return <LoadingScreen label="Opening the admin dashboard..." />;
  }

  const selectedChat = chats.find((chat) => chat.mobileNumber === selectedMobile) || null;
  const wallpaper = selectedChat?.wallpaper || settings.globalWallpaper;

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
      <div className="app-grid">
        {error ? (
          <div className="mb-5 rounded-3xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[320px,1fr,340px]">
          <ConversationList
            chats={chats}
            selectedMobile={selectedMobile}
            onSelect={setSelectedMobile}
          />

          <ChatWindow
            avatar={selectedChat?.profilePic || ''}
            composerDisabled={!selectedChat}
            currentMobile={currentUser?.mobileNumber}
            description={
              selectedChat
                ? `Replying live to ${selectedChat.mobileNumber}`
                : 'Select a conversation to start replying.'
            }
            draft={draft}
            emptyDescription="Once a user sends the first message, you can respond here and it will appear in real time."
            emptyTitle={selectedChat ? 'No messages in this thread yet' : 'Pick a user to begin'}
            loading={loadingChats || loadingMessages}
            messages={messages}
            onDraftChange={setDraft}
            onSend={handleSend}
            sending={sending}
            title={selectedChat?.mobileNumber || 'Kasi dashboard'}
            wallpaper={wallpaper}
          />

          <AdminSettingsPanel
            busy={busy}
            onGlobalWallpaperReset={clearGlobalWallpaper}
            onGlobalWallpaperSelect={updateGlobalWallpaper}
            onLogout={() => {
              logout();
              router.replace('/');
            }}
            onThemeDraftChange={(value) => {
              setThemeDraft(value);

              if (HEX_COLOR_PATTERN.test(value)) {
                mergeSettings({
                  themeColor: value
                });
              }
            }}
            onThemeSave={saveThemeColor}
            onUserWallpaperReset={clearSelectedUserWallpaper}
            onUserWallpaperSelect={updateSelectedUserWallpaper}
            selectedChat={selectedChat}
            settings={settings}
            themeDraft={themeDraft}
          />
        </div>
      </div>
    </main>
  );
}
