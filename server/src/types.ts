import { Request, Response } from 'express';
import { Session } from 'express-session';
import Redis from 'ioredis';

export type Context = {
	req: Request & { session: Session & { user_id: number } };
	res: Response;
	redis: Redis.Redis;
};
