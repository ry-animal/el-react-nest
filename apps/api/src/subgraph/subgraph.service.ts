import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import NodeCache from 'node-cache';
import { firstValueFrom } from 'rxjs';
import { SortField, SortDirection, sortAVSData, isValidEthereumAddress } from '@el-react-nest/shared';

@Injectable()
export class SubgraphService {
    private readonly endpoint = 'https://subgraph.satsuma-prod.com/027e731a6242/eigenlabs/eigen-graph-testnet-holesky/api';
    private cache = new NodeCache({ stdTTL: 300 });

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

            return response.data?.data?.avss || [];
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            throw error;
        }
    }

    async getHistoricalTrends(days: number) {
        const cacheKey = `trends_${days}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached) return cached;

        try {
            const response = await firstValueFrom(
                this.httpService.post(this.endpoint, {
                    query: `
                        query HistoricalTrends($days: Int!) {
                            dailySnapshots(
                                first: $days,
                                orderBy: timestamp,
                                orderDirection: desc
                            ) {
                                timestamp
                                totalStaked
                                operatorCount
                                strategyCount
                            }
                        }
                    `,
                    variables: { days },
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
            );

            const data = response.data?.data?.dailySnapshots || [];
            this.cache.set(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Error fetching historical trends:', error);
            throw error;
        }
    }
    
    async invalidateCache(key?: string) {
        if (key) {
            this.cache.del(key);
        } else {
            this.cache.flushAll();
        }
    }

    validateAndSortData(data: any[], sortField: string, sortDirection: string) {
        
        if (!Object.values(SortField).includes(sortField as SortField)) {
            throw new BadRequestException('Invalid sort field');
        }

        if (!['asc', 'desc'].includes(sortDirection)) {
            throw new BadRequestException('Invalid sort direction');
        }
        
        return data.sort((a, b) => sortAVSData(a, b, sortField, sortDirection as SortDirection));
    }

    validateAddress(address: string) {
        if (!isValidEthereumAddress(address)) {
            throw new BadRequestException('Invalid Ethereum address');
        }
    }
}