import { MikroORM } from '@mikro-orm/core/MikroORM';
import { Post } from './entities/Post';
import ormConfig from './mikro-orm.config';

async function main () {
	const orm = await MikroORM.init(ormConfig);

	const post = orm.em.create(Post, {
		title: 'Hello World'
	});

	await orm.em.persistAndFlush(post);
}

main();
