import { ApolloClient, InMemoryCache } from '@apollo/client';
import { withApollo as createWithApollo } from 'next-apollo';
import { PaginatedPosts } from '../generated/graphql';

const apolloClient = new ApolloClient({
	credentials: 'include',
	uri: 'http://localhost:5000/graphql',
	cache: new InMemoryCache({
		typePolicies: {
			Query: {
				fields: {
					posts: {
						keyArgs: [],
						merge(existing: PaginatedPosts | undefined, incoming: PaginatedPosts): PaginatedPosts {
							return {
								...incoming,
								posts: [...(existing?.posts ?? []), ...incoming.posts],
							};
						},
					},
				},
			},
		},
	}),
});

export const withApollo = createWithApollo(apolloClient);
