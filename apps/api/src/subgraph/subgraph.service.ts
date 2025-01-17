import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SubgraphService {
    private readonly endpoint = 'https://subgraph.satsuma-prod.com/027e731a6242/eigenlabs/eigen-graph-testnet-holesky/api';

    constructor(private readonly httpService: HttpService) {}

    async getAVSData(skip: number, first: number, orderBy: string, orderDirection: string) {
        const typeQuery = `
            query {
                __type(name: "AVS") {
                    fields {
                        name
                        type {
                            name
                            kind
                        }
                    }
                }
            }
        `;

        try {
            const typeResponse = await firstValueFrom(
                this.httpService.post(this.endpoint, {
                    query: typeQuery,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
            );
            
            const query = `
                query GetAVSs($skip: Int!, $first: Int!, $orderBy: String!, $orderDirection: String!) {
                    avss(
                        skip: $skip
                        first: $first
                        orderBy: $orderBy
                        orderDirection: $orderDirection
                    ) {
                        id
                        owner
                        operatorCount
                        strategyCount
                        stakerCount
                        slashingCount
                        lastUpdateBlockNumber
                        lastUpdateBlockTimestamp
                        metadataURI
                    }
                }
            `;

            const response = await firstValueFrom(
                this.httpService.post(this.endpoint, {
                    query,
                    variables: {
                        skip,
                        first,
                        orderBy,
                        orderDirection
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
            );

            console.log('AVS Response:', JSON.stringify(response.data, null, 2));
            return response.data?.data?.avss || [];
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            throw error;
        }
    }
}