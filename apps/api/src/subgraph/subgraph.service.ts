import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ApolloClient, InMemoryCache, gql, HttpLink } from '@apollo/client/core';
import fetch from 'cross-fetch';
import { SortField, SortDirection } from './models/sort.model';

@Injectable()
export class SubgraphService {
  private client: ApolloClient<any>;

  constructor() {
    this.client = new ApolloClient({
      link: new HttpLink({
        uri: 'https://subgraph.satsuma-prod.com/027e731a6242/eigenlabs/eigen-graph-testnet-holesky/api',
        fetch,
      }),
      cache: new InMemoryCache(),
      defaultOptions: {
        query: {
          fetchPolicy: 'no-cache',
        },
      },
    });
  }

  async getAVSData(skip = 0, first = 10, orderBy = 'lastUpdateBlockTimestamp', orderDirection = 'desc') {
    const query = gql`
      query GetAVSData($skip: Int!, $first: Int!, $orderBy: String!, $orderDirection: String!) {
        avss(
          skip: $skip, 
          first: $first,
          orderBy: $orderBy,
          orderDirection: $orderDirection
        ) {
          id
          owner
          operatorCount
          operatorSetCount
          slashingCount
          strategyCount
          stakerCount
          metadataURI
          lastUpdateBlockNumber
          lastUpdateBlockTimestamp
        }
      }
    `;

    const { data } = await this.client.query({
      query,
      variables: { skip, first, orderBy, orderDirection }
    });
    return data.avss;
  }
}