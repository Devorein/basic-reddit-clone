import { cacheExchange } from '@urql/exchange-graphcache';
import { dedupExchange, fetchExchange } from 'urql';
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql';
import { typedUpdateQuery } from './typedUpdateQuery';

export const createUrqlClient = () => ({
	url: 'http://localhost:5000/graphql',
	fetchOptions: { credentials: 'include' },
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
		fetchExchange
	]
});
