import mongoose from 'mongoose';

if (!process.env.DB_LINK) {
  throw new Error('Please define the DB_LINK environment variable inside .env');
}

const MONGODB_URI: string = process.env.DB_LINK;

interface MongoDBOptions {
  bufferCommands: boolean;
  autoCreate: boolean;
  autoIndex: boolean;
  maxPoolSize: number;
  serverSelectionTimeoutMS: number;
  socketTimeoutMS: number;
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/* eslint-disable no-var */
declare global {
  var mongooseCache: Cached;
}
/* eslint-enable no-var */

const cached: Cached = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: MongoDBOptions = {
      bufferCommands: false,
      autoCreate: true,
      autoIndex: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    console.log('Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Successfully connected to MongoDB');
      return mongoose;
    }).catch((error) => {
      console.error('MongoDB connection error:', error);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
