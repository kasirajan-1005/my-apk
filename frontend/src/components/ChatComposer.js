'use client';

export default function ChatComposer({
  disabled = false,
  draft,
  onDraftChange,
  onSend,
  sending = false
}) {
  return (
    <div className="border-t border-sky-100/90 bg-sky-50/80 p-3 sm:p-4">
      <div className="flex items-end gap-3">
        <button
          className="hidden h-[54px] w-[54px] items-center justify-center rounded-full border border-sky-100 bg-white text-sky-600 shadow-sm sm:flex"
          type="button"
        >
          <svg fill="none" height="22" viewBox="0 0 24 24" width="22">
            <path
              d="M12 5V19M5 12H19"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.8"
            />
          </svg>
        </button>

        <textarea
          className="min-h-[54px] flex-1 rounded-[28px] border border-sky-100 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
          disabled={disabled || sending}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              onSend();
            }
          }}
          placeholder={disabled ? 'Select a chat to start replying...' : 'Type your message'}
          rows={1}
          value={draft}
        />

        <button
          className="brand-gradient flex h-[54px] min-w-[54px] items-center justify-center rounded-full px-5 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled || sending || !draft.trim()}
          onClick={onSend}
          type="button"
        >
          {sending ? (
            '...'
          ) : (
            <svg fill="none" height="20" viewBox="0 0 24 24" width="20">
              <path
                d="M4 12L19 5L14 19L11 13L4 12Z"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
