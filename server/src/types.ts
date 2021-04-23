import { Request, Response } from 'express';
import { Session } from 'express-session';
import Redis from 'ioredis';
import { createUserLoader } from './utils/createUserLoader';

export type Context = {
	req: Request & { session: Session & { user_id: number } };
	res: Response;
	redis: Redis.Redis;
	userLoader: ReturnType<typeof createUserLoader>;
};
