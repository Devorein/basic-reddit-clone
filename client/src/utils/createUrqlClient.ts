import { cacheExchange } from '@urql/exchange-graphcache';
import Router from 'next/router';
import { dedupExchange, Exchange, fetchExchange } from 'urql';
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

export const createUrqlClient = (ssrExchange: any) => ({
	url: 'http://localhost:5000/graphql',
	fetchOptions: { credentials: 'include' as const },
	exchanges: [
		dedupExchange,
		cacheExchange({
			updates: {
				Mutation: {
					logout: (result, args, cache, info) => {
						typedUpdateQuery<LogoutMutation, MeQuery>(cache, { query: MeDocument }, result, () => ({
							me: null
						}));
					},
					login: (result, args, cache, info) => {
						typedUpdateQuery<LoginMutation, MeQuery>(cache, { query: MeDocument }, result, (_result, query) => {
							if (_result.login.errors) return query;
							else
								return {
									me: _result.login.user
								};
						});
					},
					register: (result, args, cache, info) => {
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
