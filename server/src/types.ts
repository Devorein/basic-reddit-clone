import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { Request, Response } from 'express';

export type Context = {
	req: Request;
	res: Response;
	em: EntityManager<IDatabaseDriver<Connection>>;
};
