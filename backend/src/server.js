import http from 'node:http';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { Server } from 'socket.io';
import connectDatabase, { stopDatabase } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { verifyAuthToken } from './utils/tokens.js';
import { ensureAdminSettings } from './utils/settings.js';

dotenv.config();

function getAllowedOrigins() {
  return String(process.env.CLIENT_URL || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function createCorsOptions() {
  const allowedOrigins = getAllowedOrigins();

  return {
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  };
}

function assertRequiredEnvironmentVariables() {
  const useInMemoryDb = String(process.env.USE_IN_MEMORY_DB || '').toLowerCase() === 'true';
  const requiredKeys = ['JWT_SECRET', 'ADMIN_MOBILE_NUMBER', 'ADMIN_PIN'];

  if (!useInMemoryDb) {
    requiredKeys.unshift('MONGODB_URI');
  }

  const missingKeys = requiredKeys.filter((key) => !process.env[key]);

  if (missingKeys.length > 0) {
    throw new Error(`Missing environment variables: ${missingKeys.join(', ')}`);
  }
}

async function bootstrap() {
  assertRequiredEnvironmentVariables();
  await connectDatabase();
  await ensureAdminSettings();

  const app = express();
  const server = http.createServer(app);
  const corsOptions = createCorsOptions();
  const io = new Server(server, {
    cors: corsOptions
  });

  io.use((socket, next) => {
    try {
      const rawToken =
        socket.handshake.auth?.token ||
        (socket.handshake.headers.authorization || '').replace(/^Bearer\s+/i, '');

      const payload = verifyAuthToken(rawToken);
      socket.data.auth = payload;
      next();
    } catch (error) {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const { mobileNumber, role } = socket.data.auth;

    if (role === 'admin') {
      socket.join('admins');
    }

    if (role === 'user') {
      socket.join(`thread:${mobileNumber}`);
    }
  });

  app.use(cors(corsOptions));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      message: 'DM to Kasi backend is running.'
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/admin', adminRoutes);

  app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({
      message: 'Something went wrong on the server.'
    });
  });

  const port = Number(process.env.PORT) || 5000;
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

  async function shutdown() {
    await stopDatabase();
    process.exit(0);
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
