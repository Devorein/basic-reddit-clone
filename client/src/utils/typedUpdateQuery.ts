import { Cache, QueryInput } from '@urql/exchange-graphcache';

export const typedUpdateQuery = <Result, Query>(
	cache: Cache,
	qi: QueryInput,
	result: any,
	fn: (result: Result, query: Query) => Query
) => {
	return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
};
