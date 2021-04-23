import DataLoader from 'dataloader';
import User from '../entities/User';

export const createUserLoader = () =>
	new DataLoader<number, User>(async (userIds) => {
		const users = await User.findByIds(userIds as number[]);
		const userIdToUserMap: Record<number, User> = {};
		users.forEach((user) => (userIdToUserMap[user.id] = user));
		return userIds.map((userId) => userIdToUserMap[userId]);
	});
