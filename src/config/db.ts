import mongoose from 'mongoose';
import env from './env';

const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.info('☘️ Database connected successfully.');
  } catch (error) {
    if (error instanceof Error) {
      console.error('MongoDb connection error:', error);
    }

    process.exit(1);
  }
};

export default connectDB;
