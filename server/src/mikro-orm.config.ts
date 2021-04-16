import { MikroORM } from '@mikro-orm/core';
import path from 'path';
import { __PROD__ } from './constants';
import Post from './entities/Post';

export default {
	migrations: {
		path: path.join(__dirname, './migrations'),
		pattern: /^[\w-]+\d+\.[tj]s$/
	},
	dbName: 'lireddit',
	entities: [ Post ],
	user: 'postgres',
	password: 'root',
	debug: !__PROD__,
	type: 'postgresql'
} as Parameters<typeof MikroORM.init>[0];
