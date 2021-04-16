import { MikroORM } from '@mikro-orm/core/MikroORM';
import path from 'path';
import { __PROD__ } from './constants';
import { Post } from './entities/Post';

export default {
	migrations: {
		path: path.join(__dirname, './migrations'),
		pattern: /^[\w-]+\d+\.ts$/
	},
	entities: [ Post ],
	dbName: 'lireddit',
	user: 'postgres',
	password: 'postgres',
	type: 'postgresql',
	debug: !__PROD__
} as Parameters<typeof MikroORM.init>[0];
