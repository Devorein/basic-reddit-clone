import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { Request, Response } from 'express';
import { Session } from 'express-session';

export type Context = {
	req: Request & { session: Session & { user_id: number } };
	res: Response;
	em: EntityManager<IDatabaseDriver<Connection>>;
};
