import { MikroORM } from '@mikro-orm/core';
import { __PROD__ } from './constants';

async function main () {
	const orm = await MikroORM.init({
		dbName: 'lireddit',
		user: 'postgres',
		password: 'postgres',
		type: 'postgresql',
		debug: !__PROD__
	});
}

main();
