'use client';

import { useEffect, useRef } from 'react';
import Avatar from '@/components/Avatar';
import ChatComposer from '@/components/ChatComposer';
import MessageBubble from '@/components/MessageBubble';
import PanelCard from '@/components/PanelCard';

function buildWallpaperStyle(wallpaper) {
  if (!wallpaper) {
    return {
      background:
        'linear-gradient(180deg, rgba(224, 242, 254, 0.72) 0%, rgba(248, 250, 252, 0.88) 100%)'
    };
  }

  return {
    backgroundImage: `linear-gradient(rgba(240, 249, 255, 0.72), rgba(248, 250, 252, 0.82)), url("${wallpaper}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };
}

export default function ChatWindow({
  avatar,
  className = '',
  currentMobile,
  description,
  draft,
  emptyDescription,
  emptyTitle,
  headerActions,
  loading,
  messages,
  onDraftChange,
  onSend,
  sending,
  title,
  wallpaper,
  composerDisabled = false
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    });
  }, [messages]);

  return (
    <PanelCard className={`flex min-h-[720px] flex-col overflow-hidden ${className}`.trim()}>
      <header className="flex items-center justify-between gap-4 border-b border-sky-200/60 px-5 py-4 text-white sm:px-6 brand-gradient">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-12 w-12" label={title} src={avatar} />
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold">{title}</h2>
            <p className="truncate text-sm text-white/75">{description}</p>
          </div>
        </div>

        {headerActions}
      </header>

      <div
        className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6"
        style={buildWallpaperStyle(wallpaper)}
      >
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-[32px] border border-dashed border-white/80 bg-white/55 px-6 text-center">
            <h3 className="text-xl font-semibold text-slate-900">{emptyTitle}</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{emptyDescription}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <MessageBubble currentMobile={currentMobile} key={message.id} message={message} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <ChatComposer
        disabled={composerDisabled}
        draft={draft}
        onDraftChange={onDraftChange}
        onSend={onSend}
        sending={sending}
      />
    </PanelCard>
  );
}
