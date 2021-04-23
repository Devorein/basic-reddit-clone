import DataLoader from 'dataloader';
import Upvote from '../entities/Upvote';

export const createUpvoteLoader = () =>
	new DataLoader<{ postId: number; userId: number }, Upvote | null>(async (keys) => {
		const upvotes = await Upvote.findByIds(keys as any);
		const upvoteIdToUpvoteMap: Record<string, Upvote> = {};
		upvotes.forEach(
			(upvote) => (upvoteIdToUpvoteMap[`${upvote.postId}.${upvote.userId}`] = upvote)
		);
		return keys.map((key) => upvoteIdToUpvoteMap[`${key.postId}.${key.userId}`]);
	});
