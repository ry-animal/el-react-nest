import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ApolloClient, InMemoryCache, gql, HttpLink } from '@apollo/client/core';
import fetch from 'cross-fetch';

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

  async getAVSData(): Promise<any> {
    const AVS_QUERY = gql`
      query {
        avss(first: 10) {
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

    try {
      const { data } = await this.client.query({
        query: AVS_QUERY,
      });
      
      console.log('Subgraph Response:', data);
      
      if (!data || !data.avss) {
        throw new Error('No data received from subgraph');
      }

      return data.avss;
    } catch (error) {
      console.error('Subgraph Error:', error);
      throw new HttpException(
        `Failed to fetch AVS data: ${error.message}`,
        HttpStatus.BAD_GATEWAY
      );
    }
  }
}