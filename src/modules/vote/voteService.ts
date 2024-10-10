import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { monthNames } from '../../constant';
import AppError from '../../errors/app-error';
import Post from '../post/postModel';
import Vote from './voteModel';
import { VoteType } from './voteValidation';

export const voteOnPostService = async (
  postId: Types.ObjectId,
  userId: Types.ObjectId,
  voteType: VoteType
) => {
  const post = await Post.findById(postId);

  if (!post) throw new AppError('Post not found', httpStatus.NOT_FOUND);

  const existingVote = await Vote.findOne({
    post: postId,
    user: userId,
  });

  if (existingVote) {
    if (existingVote.voteType === voteType) {
      await Vote.deleteOne({ _id: existingVote._id });
      post.votes += voteType === VoteType.Upvote ? -1 : 1;
    } else {
      existingVote.voteType = voteType;
      await existingVote.save();
      post.votes += voteType === VoteType.Upvote ? 2 : -2;
    }
  } else {
    const newVote = new Vote({ voteType, post: postId, user: userId });
    await newVote.save();
    post.votes += voteType === VoteType.Upvote ? 1 : -1;
  }

  await post.save();
  return post;
};

export const getMonthlyVotesService = async () => {
  const votes = await Vote.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalVotes: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return votes.map(({ _id, totalVotes }) => {
    const [year, month] = _id.split('-');
    return {
      month: monthNames[parseInt(month, 10) - 1],
      year,
      totalVotes,
    };
  });
};

// export const getMonthlyVotesService = async () => {
//   const votes = await Vote.aggregate([
//     {
//       $group: {
//         _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
//         totalVotes: { $sum: 1 },
//       },
//     },
//     { $sort: { _id: 1 } },
//   ]);
//   return votes;
// };
