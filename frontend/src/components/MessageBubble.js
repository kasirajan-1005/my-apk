import { formatMessageTime } from '@/lib/chat';

export default function MessageBubble({ currentMobile, message }) {
  const isOwnMessage = message.sender === currentMobile;

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[84%] px-4 py-3 sm:max-w-[72%] ${
          isOwnMessage
            ? 'rounded-[22px] rounded-br-[8px] text-slate-950'
            : 'rounded-[22px] rounded-bl-[8px] text-slate-800'
        }`}
        style={
          isOwnMessage
            ? {
                background: 'linear-gradient(135deg, rgba(224,242,254,0.96), rgba(186,230,253,0.98))',
                boxShadow: '0 12px 26px rgba(14, 165, 233, 0.18)'
              }
            : {
                background: 'rgba(255, 255, 255, 0.98)',
                boxShadow: '0 10px 22px rgba(15, 23, 42, 0.08)'
              }
        }
      >
        <p className="whitespace-pre-wrap break-words text-sm leading-6 sm:text-[15px]">
          {message.message}
        </p>
        <p
          className={`mt-2 text-[11px] ${
            isOwnMessage ? 'text-sky-700/75' : 'text-slate-400'
          }`}
        >
          {formatMessageTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
