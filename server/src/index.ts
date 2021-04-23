import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import expressSession from 'express-session';
import Redis from 'ioredis';
import path from 'path';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { COOKIE_NAME, __PROD__ } from './constants';
import Post from './entities/Post';
import Upvote from './entities/Upvote';
import User from './entities/User';
import { PostResolver } from './resolvers/Post';
import { UserResolver } from './resolvers/User';
import { createUserLoader } from './utils/createUserLoader';

async function main () {
	const conn = await createConnection({
		type: 'postgres',
		database: 'lireddit2',
		username: 'postgres',
		password: 'root',
		logging: true,
		synchronize: true,
		migrations: [ path.join(__dirname, '/migrations/*') ],
		entities: [ User, Post, Upvote ]
	});

	await conn.runMigrations();

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
			req,
			res,
			redis,
      userLoader: createUserLoader()
		})
	});
	apolloServer.applyMiddleware({ app, cors: false });
	app.listen(5000, () => {
		console.log('Server listening on port http://localhost:5000/graphql');
	});
}

main();
