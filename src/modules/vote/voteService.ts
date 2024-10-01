import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';
import AppError from '../../errors/app-error';
import Post from '../post/postModel';
import Vote from './voteModel';
import { VoteType } from './voteValidation';

export const voteOnPostService = async (
  postId: Types.ObjectId,
  userId: Types.ObjectId,
  voteType: VoteType
) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const post = await Post.findById(postId).session(session);

    if (!post) throw new AppError('Post not found', httpStatus.NOT_FOUND);

    const existingVote = await Vote.findOne({
      post: postId,
      user: userId,
    }).session(session);

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        await Vote.deleteOne({ _id: existingVote._id }).session(session);
        post.votes += voteType === VoteType.Upvote ? -1 : 1;
      } else {
        existingVote.voteType = voteType;
        await existingVote.save({ session });
        post.votes += voteType === VoteType.Upvote ? 2 : -2;
      }
    } else {
      const newVote = new Vote({ voteType, post: postId, user: userId });

      await newVote.save({ session });

      post.votes += voteType === VoteType.Upvote ? 1 : -1;
    }

    await post.save({ session });
    await session.commitTransaction();
    return post;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
