'use client';

import { useEffect, useState } from 'react';
import ChatWindow from '@/components/ChatWindow';
import LoadingScreen from '@/components/LoadingScreen';
import PanelCard from '@/components/PanelCard';
import UserAppShell from '@/components/UserAppShell';
import { useUserAppPage } from '@/hooks/useUserAppPage';
import { apiRequest } from '@/lib/api';
import { formatConversationTime, upsertMessage } from '@/lib/chat';

export default function ChatPage() {
  const { currentUser, isLoading, settings, token } = useUserAppPage();
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [loadingThread, setLoadingThread] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadMessages() {
      if (!token) {
        return;
      }

      setLoadingThread(true);
      setError('');

      try {
        const response = await apiRequest('/messages', {
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
          setLoadingThread(false);
        }
      }
    }

    loadMessages();

    return () => {
      ignore = true;
    };
  }, [token]);

  async function handleSend() {
    const trimmedDraft = draft.trim();

    if (!trimmedDraft || sending) {
      return;
    }

    setSending(true);
    setError('');

    try {
      const response = await apiRequest('/messages', {
        method: 'POST',
        token,
        body: {
          message: trimmedDraft
        }
      });

      setMessages((previousMessages) => upsertMessage(previousMessages, response.message));
      setDraft('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSending(false);
    }
  }

  if (isLoading) {
    return <LoadingScreen label="Loading your chat..." />;
  }

  const wallpaper = currentUser?.wallpaper || settings.globalWallpaper;
  const latestMessage = messages[messages.length - 1];

  return (
    <UserAppShell
      currentPath="/chat"
      currentUser={currentUser}
      headerSubtitle="A cleaner WhatsApp-style layout centered on your chat with Kasi."
      headerTitle="Chats"
    >
      {error ? (
        <div className="mb-4 rounded-3xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[340px,1fr]">
        <PanelCard className="overflow-hidden">
          <div className="border-b border-white/70 p-5">
            <p className="text-sm font-semibold text-slate-900">Recent conversations</p>
            <p className="mt-1 text-sm text-slate-500">
              A familiar chat list feel, streamlined for your one direct thread with Kasi.
            </p>
          </div>

          <div className="p-5">
            <div className="rounded-full border border-sky-100 bg-slate-50/90 px-4 py-3 text-sm text-slate-400">
              Search chats
            </div>

            <button
              className="mt-4 w-full rounded-[28px] border border-sky-200 bg-sky-50/85 p-4 text-left shadow-sm transition hover:bg-sky-50"
              type="button"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-slate-950">Kasi</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {latestMessage?.message || 'Start the first message in your personal chat.'}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-medium text-sky-700">
                  {latestMessage ? formatConversationTime(latestMessage.timestamp) : 'New'}
                </span>
              </div>
            </button>

            <div className="mt-4 grid gap-3">
              <div className="rounded-[24px] border border-sky-100 bg-white/85 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                  Thread style
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">WhatsApp-inspired</p>
                <p className="mt-1 text-sm text-slate-500">
                  Compact list, rounded bubbles, and a cleaner message-first layout.
                </p>
              </div>

              <div className="rounded-[24px] border border-sky-100 bg-white/85 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                  Wallpaper
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {wallpaper ? 'Custom background active' : 'Using default gradient'}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Open Settings to change your profile picture and chat appearance.
                </p>
              </div>
            </div>
          </div>
        </PanelCard>

        <ChatWindow
          avatar=""
          className="min-h-[680px]"
          currentMobile={currentUser?.mobileNumber}
          description="Online now"
          draft={draft}
          emptyDescription="Say hello to start your real-time chat. Messages will appear here instantly when Kasi replies."
          emptyTitle="No messages yet"
          headerActions={
            <div className="flex items-center gap-2">
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/12 text-white transition hover:bg-white/20"
                type="button"
              >
                <svg fill="none" height="18" viewBox="0 0 24 24" width="18">
                  <path
                    d="M7.2 4.75L10.1 7.15C10.52 7.5 10.67 8.08 10.48 8.59L9.63 10.79C10.44 12.39 11.72 13.63 13.3 14.4L15.47 13.5C15.98 13.29 16.58 13.41 16.95 13.82L19.4 16.62C19.84 17.12 19.87 17.87 19.47 18.4C18.8 19.29 17.75 19.8 16.64 19.8C10.5 19.8 5.52 14.82 5.52 8.68C5.52 7.55 6.05 6.5 6.96 5.82C7.49 5.43 8.24 5.46 8.72 5.88"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.7"
                  />
                </svg>
              </button>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/12 text-white transition hover:bg-white/20"
                type="button"
              >
                <svg fill="none" height="18" viewBox="0 0 24 24" width="18">
                  <path
                    d="M14 8.5H6.75C5.784 8.5 5 9.284 5 10.25V15.25C5 16.216 5.784 17 6.75 17H14C14.966 17 15.75 16.216 15.75 15.25V10.25C15.75 9.284 14.966 8.5 14 8.5Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M15.75 11.15L19 9.5V16L15.75 14.35V11.15Z"
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                  />
                </svg>
              </button>
            </div>
          }
          loading={loadingThread}
          messages={messages}
          onDraftChange={setDraft}
          onSend={handleSend}
          sending={sending}
          title="Kasi"
          wallpaper={wallpaper}
        />
      </div>
    </UserAppShell>
  );
}
