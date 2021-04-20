import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import expressSession from 'express-session';
import Redis from 'ioredis';
import { buildSchema } from 'type-graphql';
import { COOKIE_NAME, __PROD__ } from './constants';
import ormConfig from './mikro-orm.config';
import { PostResolver } from './resolvers/Post';
import { UserResolver } from './resolvers/User';

async function main () {
	const orm = await MikroORM.init(ormConfig);
	await orm.getMigrator().up();

	const app = express();

	const RedisStore = connectRedis(expressSession);
	const redis = new Redis();
	app.use(
		cors({
			origin: 'http://localhost:3000',
			credentials: true
		})
	);
	app.use(
		expressSession({
			name: COOKIE_NAME,
			store: new RedisStore({ client: redis, disableTouch: true, disableTTL: true }),
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 * 30, // a month
				httpOnly: true,
				secure: __PROD__,
				sameSite: 'lax'
			},
			saveUninitialized: false,
			secret: 'redis_secret',
			resave: false
		})
	);

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [ PostResolver, UserResolver ],
			validate: false
		}),
		context: ({ req, res }) => ({
			em: orm.em,
			req,
			res,
			redis
		})
	});
	apolloServer.applyMiddleware({ app, cors: false });
	app.listen(5000, () => {
		console.log('Server listening on port 5000');
	});
}

main();
