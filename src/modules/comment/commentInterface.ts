import { ObjectId } from 'mongoose';

export interface IComment {
  post: ObjectId;
  user: ObjectId;
  content: string;
  replyTo?: ObjectId[];
  replies?: ObjectId[];
}
