import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';
import ormConfig from './mikro-orm.config';
import { PostResolver } from './resolvers/Post';
import { UserResolver } from './resolvers/User';

async function main () {
	const orm = await MikroORM.init(ormConfig);
	await orm.getMigrator().up();

	const app = express();

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [ PostResolver, UserResolver ],
			validate: false
		}),
		context: () => ({
			em: orm.em
		})
	});

	apolloServer.applyMiddleware({ app });
	app.listen(5000, () => {
		console.log('Server listening on port 5000');
	});
}

main();
