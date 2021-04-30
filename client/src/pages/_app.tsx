import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import { PaginatedPosts } from "../generated/graphql";
import theme from '../theme';

const client = new ApolloClient({
  credentials: "include",
  uri: "http://localhost:5000/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: [],
            merge(existing: PaginatedPosts | undefined, incoming: PaginatedPosts): PaginatedPosts {
              return {
                ...incoming,
                posts: [...(existing?.posts ?? []), ...incoming.posts]
              }
            }
          }
        }
      }
    }
  })
})

function MyApp({ Component, pageProps }: any) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </ApolloProvider>
  )
}

export default MyApp
