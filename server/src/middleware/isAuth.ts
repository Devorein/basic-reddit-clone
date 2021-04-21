import { MiddlewareFn } from 'type-graphql';
import { Context } from '../types';

export const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
	if (!context.req.session.user_id) throw new Error('User not authenticated');

	return next();
};
