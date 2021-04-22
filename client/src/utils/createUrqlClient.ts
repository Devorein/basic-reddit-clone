import { cacheExchange, Resolver } from '@urql/exchange-graphcache';
import Router from 'next/router';
import { dedupExchange, Exchange, fetchExchange, stringifyVariables } from 'urql';
import { pipe, tap } from 'wonka';
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql';
import { typedUpdateQuery } from './typedUpdateQuery';

const errorExchange: Exchange = ({forward}) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({error})=> {
      if(error?.message.includes("not authenticated")){
        Router.replace("/login")
      }
    })
  )
}

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      "posts"
    );
    info.partial = !isItInTheCache;
    let hasMore = true;
    const results: string[] = [];
    fieldInfos.forEach((fi) => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore");
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      results.push(...data);
    });

    return {
      __typename: "PaginatedPosts",
      hasMore,
      posts: results,
    };
  };
};

export const createUrqlClient = (ssrExchange: any) => ({
	url: 'http://localhost:5000/graphql',
	fetchOptions: { credentials: 'include' as const },
	exchanges: [
		dedupExchange,
		cacheExchange({
      resolvers: {
        Query: {
          posts: cursorPagination()
        },
      },
			updates: {
				Mutation: {
          createPost: (result, _, cache, __) => {
            const allFields = cache.inspectFields('Query');
            const fieldInfos = allFields.filter((info) => info.fieldName === 'posts');
            fieldInfos.forEach(fieldInfo=>{
              cache.invalidate('Query', 'posts', fieldInfo.arguments || {});
            })
					},
					logout: (result, _, cache, __) => {
						typedUpdateQuery<LogoutMutation, MeQuery>(cache, { query: MeDocument }, result, () => ({
							me: null
						}));
					},
					login: (result, _, cache, __) => {
						typedUpdateQuery<LoginMutation, MeQuery>(cache, { query: MeDocument }, result, (_result, query) => {
							if (_result.login.errors) return query;
							else
								return {
									me: _result.login.user
								};
						});
					},
					register: (result, _, cache, __) => {
						typedUpdateQuery<RegisterMutation, MeQuery>(cache, { query: MeDocument }, result, (_result, query) => {
							if (_result.register.errors) return query;
							else
								return {
									me: _result.register.user
								};
						});
					}
				}
			}
		}),
    errorExchange,
		ssrExchange,
		fetchExchange
	]
});
