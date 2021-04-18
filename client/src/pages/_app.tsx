import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import { Cache, cacheExchange, QueryInput } from '@urql/exchange-graphcache';
import { createClient, dedupExchange, fetchExchange, Provider } from "urql";
import { LoginMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql';
import theme from '../theme';

const typedUpdateQuery = <Result, Query>(cache: Cache, qi: QueryInput, result: any, fn: (result: Result, query: Query,) => Query) => {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any)
}

const client = createClient({
  url: 'http://localhost:5000/graphql', fetchOptions: { credentials: 'include' }, exchanges: [dedupExchange, cacheExchange({
    updates: {
      Mutation: {
        login: (result, args, cache, info) => {
          typedUpdateQuery<LoginMutation, MeQuery>(cache, { query: MeDocument }, result, (_result, query) => {
            if (_result.login.errors)
              return query;
            else return {
              me: _result.login.user
            }
          })
        },
        register: (result, args, cache, info) => {
          typedUpdateQuery<RegisterMutation, MeQuery>(cache, { query: MeDocument }, result, (_result, query) => {
            if (_result.register.errors)
              return query;
            else return {
              me: _result.register.user
            }
          })
        }
      }
    }
  }), fetchExchange],
});

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
