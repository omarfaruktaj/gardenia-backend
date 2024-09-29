import { ObjectId } from 'mongoose';

export interface IPost {
  title: string;
  content: string;
  category: string;
  images: string[];
  author: ObjectId;
  votes?: number;
  premium?: boolean;
}
