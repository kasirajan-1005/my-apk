export function formatMessageTime(timestamp) {
  if (!timestamp) {
    return '';
  }

  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(timestamp));
}

export function formatConversationTime(timestamp) {
  if (!timestamp) {
    return 'New';
  }

  const date = new Date(timestamp);
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  return new Intl.DateTimeFormat(
    'en-IN',
    isToday ? { hour: 'numeric', minute: '2-digit' } : { day: '2-digit', month: 'short' }
  ).format(date);
}

export function abbreviateMessage(value, maxLength = 54) {
  const normalizedValue = String(value || '').trim();

  if (normalizedValue.length <= maxLength) {
    return normalizedValue;
  }

  return `${normalizedValue.slice(0, maxLength - 1)}...`;
}

export function upsertMessage(messages, incomingMessage) {
  const messageMap = new Map(messages.map((message) => [message.id, message]));
  messageMap.set(incomingMessage.id, incomingMessage);

  return [...messageMap.values()].sort(
    (first, second) => new Date(first.timestamp).getTime() - new Date(second.timestamp).getTime()
  );
}

export function sortChats(chats) {
  return [...chats].sort((first, second) => {
    const firstTimestamp = first.lastTimestamp ? new Date(first.lastTimestamp).getTime() : 0;
    const secondTimestamp = second.lastTimestamp ? new Date(second.lastTimestamp).getTime() : 0;

    if (secondTimestamp !== firstTimestamp) {
      return secondTimestamp - firstTimestamp;
    }

    return second.mobileNumber.localeCompare(first.mobileNumber);
  });
}

export function upsertChat(chats, mobileNumber, patch = {}) {
  let matchFound = false;

  const nextChats = chats.map((chat) => {
    if (chat.mobileNumber !== mobileNumber) {
      return chat;
    }

    matchFound = true;
    return {
      ...chat,
      ...patch,
      mobileNumber
    };
  });

  if (!matchFound) {
    nextChats.push({
      mobileNumber,
      profilePic: '',
      wallpaper: '',
      lastMessage: '',
      lastTimestamp: null,
      lastSender: '',
      hasMessages: false,
      ...patch
    });
  }

  return sortChats(nextChats);
}
