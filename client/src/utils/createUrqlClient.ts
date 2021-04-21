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
    const {parentKey: entityKey, fieldName} = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter(field=>field.fieldName === fieldName);
    const size = fieldInfos.length;
    if(size === 0)
      return undefined;
    const dataIds: string[] = [];
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(entityKey, fieldKey)
    info.partial = !isItInTheCache;
    fieldInfos.forEach(fieldInfo=>{
      const data = cache.resolve(entityKey, fieldInfo.fieldKey) as string[];
      dataIds.push(...data)
    });
    return dataIds;
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
