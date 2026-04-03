import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer;

export async function stopDatabase() {
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = undefined;
  }
}

export default async function connectDatabase() {
  mongoose.set('strictQuery', true);

  const useInMemoryDb = String(process.env.USE_IN_MEMORY_DB || '').toLowerCase() === 'true';

  if (useInMemoryDb) {
    memoryServer = await MongoMemoryServer.create();
    await mongoose.connect(memoryServer.getUri('dm-to-kasi'));
    console.log('MongoDB connected (in-memory)');
    return;
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');
}
