import Avatar from '@/components/Avatar';
import PanelCard from '@/components/PanelCard';
import { abbreviateMessage, formatConversationTime } from '@/lib/chat';

export default function ConversationList({ chats, selectedMobile, onSelect }) {
  return (
    <PanelCard className="overflow-hidden">
      <div className="border-b border-white/70 px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
          Admin inbox
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">All chats</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Monitor every user conversation and jump into any thread instantly.
        </p>
      </div>

      <div className="max-h-[720px] overflow-y-auto p-3">
        {chats.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-sky-100 bg-white/70 px-5 py-12 text-center">
            <p className="text-sm font-medium text-slate-700">No users yet</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              User conversations will appear here as soon as someone logs in.
            </p>
          </div>
        ) : (
          chats.map((chat) => {
            const isSelected = selectedMobile === chat.mobileNumber;

            return (
              <button
                className={`mb-2 w-full rounded-[24px] border p-4 text-left transition ${
                  isSelected
                    ? 'border-sky-300 bg-sky-50 shadow-lg shadow-sky-100'
                    : 'border-transparent bg-white/72 hover:border-sky-100 hover:bg-white'
                }`}
                key={chat.mobileNumber}
                onClick={() => onSelect(chat.mobileNumber)}
                type="button"
              >
                <div className="flex items-start gap-3">
                  <Avatar
                    className="h-12 w-12 shrink-0"
                    label={chat.mobileNumber}
                    src={chat.profilePic}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {chat.mobileNumber}
                      </p>
                      <span className="shrink-0 text-xs text-slate-400">
                        {formatConversationTime(chat.lastTimestamp)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">
                      {chat.lastMessage
                        ? abbreviateMessage(chat.lastMessage)
                        : 'Logged in and ready to chat'}
                    </p>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </PanelCard>
  );
}
