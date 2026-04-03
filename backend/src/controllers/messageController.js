import Message from '../models/Message.js';
import { isValidMobileNumber, normalizeMobileNumber } from '../utils/mobile.js';
import { serializeMessage } from '../utils/serializers.js';

function getAdminMobileNumber() {
  return normalizeMobileNumber(process.env.ADMIN_MOBILE_NUMBER);
}

function buildConversationQuery(firstMobile, secondMobile) {
  return {
    $or: [
      { sender: firstMobile, receiver: secondMobile },
      { sender: secondMobile, receiver: firstMobile }
    ]
  };
}

function resolveConversationContext(auth, otherMobileInput) {
  const adminMobileNumber = getAdminMobileNumber();

  if (auth.role === 'admin') {
    const userMobileNumber = normalizeMobileNumber(otherMobileInput);

    if (!isValidMobileNumber(userMobileNumber) || userMobileNumber === adminMobileNumber) {
      return null;
    }

    return {
      currentMobileNumber: adminMobileNumber,
      otherMobileNumber: userMobileNumber,
      threadRoom: `thread:${userMobileNumber}`
    };
  }

  return {
    currentMobileNumber: auth.mobileNumber,
    otherMobileNumber: adminMobileNumber,
    threadRoom: `thread:${auth.mobileNumber}`
  };
}

export async function getMessages(req, res) {
  const context = resolveConversationContext(req.auth, req.query.withMobile);

  if (!context) {
    return res.status(400).json({
      message: 'A valid user mobile number is required.'
    });
  }

  const messages = await Message.find(
    buildConversationQuery(context.currentMobileNumber, context.otherMobileNumber)
  )
    .sort({ timestamp: 1 })
    .lean();

  return res.json({
    messages: messages.map(serializeMessage)
  });
}

export async function sendMessage(req, res) {
  const trimmedMessage = String(req.body.message || '').trim();

  if (!trimmedMessage) {
    return res.status(400).json({
      message: 'Message cannot be empty.'
    });
  }

  const context = resolveConversationContext(req.auth, req.body.receiver);

  if (!context) {
    return res.status(400).json({
      message: 'A valid receiver mobile number is required.'
    });
  }

  const createdMessage = await Message.create({
    sender: context.currentMobileNumber,
    receiver: context.otherMobileNumber,
    message: trimmedMessage
  });

  const serializedMessage = serializeMessage(createdMessage);
  const conversationUpdate = {
    userMobile: req.auth.role === 'admin' ? context.otherMobileNumber : req.auth.mobileNumber,
    lastMessage: serializedMessage
  };

  req.io.to(context.threadRoom).emit('message:new', serializedMessage);
  req.io.to('admins').emit('message:new', serializedMessage);
  req.io.to('admins').emit('conversation:update', conversationUpdate);

  return res.status(201).json({
    message: serializedMessage
  });
}
