import { ApolloClient, InMemoryCache, from } from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import { HttpLink } from '@apollo/client/link/http';

const httpLink = new HttpLink({
  uri: 'http://localhost:3001/graphql',
});

const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 3000,
    jitter: true
  },
  attempts: {
    max: 5,
    retryIf: (error) => !!error
  }
});

const client = new ApolloClient({
  link: from([retryLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
  },
});

export default client; 