import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import NodeCache from 'node-cache';
import { firstValueFrom } from 'rxjs';
import { SortField, SortDirection, sortAVSData, isValidEthereumAddress } from '@el-react-nest/shared';

interface AVSData {
    id: string;
    owner: string;
    operatorCount: number;
    strategyCount: number;
    stakerCount: number;
    slashingCount: number;
    lastUpdateBlockTimestamp: number;
    metadataURI: string;
}

interface AVSOperator {
    id: string;
    avs: AVSData;
}

@Injectable()
export class SubgraphService {
    private readonly endpoint = 'https://subgraph.satsuma-prod.com/027e731a6242/eigenlabs/eigen-graph-testnet-holesky/api';
    private cache = new NodeCache({ stdTTL: 300 });

    constructor(private readonly httpService: HttpService) {}

    async getAVSData(skip: number, first: number, orderBy: string, orderDirection: string): Promise<AVSData[]> {
        const cacheKey = 'all_avs_data';
        try {
            let allData = this.cache.get<AVSData[]>(cacheKey);

            if (!allData) {
                const response = await firstValueFrom(
                    this.httpService.post<{
                        data: {
                            avss: AVSData[];
                        };
                    }>(this.endpoint, {
                        query: `
                            query GetAVSs {
                                avss(first: 1000) {  # Fetch up to 1000 records
                                    id
                                    owner
                                    operatorCount
                                    strategyCount
                                    stakerCount
                                    slashingCount
                                    lastUpdateBlockTimestamp
                                    metadataURI
                                }
                            }
                        `
                    })
                );

                allData = response.data?.data?.avss || [];
                
                this.cache.set(cacheKey, allData, 300);
            }

            const sortedData = this.validateAndSortData([...allData], orderBy, orderDirection);
            return sortedData.slice(skip, skip + first);
        } catch (error) {
            console.error('Error fetching AVS data:', error);
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

    validateAndSortData(data: AVSData[], sortField: string, sortDirection: string): AVSData[] {
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

    async fetchMetadata(url: string) {
        try {
            if (!url) {
                throw new BadRequestException('URL is required');
            }

            if (url.startsWith('ipfs://')) {
                url = url.replace('ipfs://', 'https://ipfs.io/ipfs/');
            }

            const validUrl = new URL(url);
            if (!validUrl.protocol.startsWith('http')) {
                throw new BadRequestException('Invalid URL protocol');
            }

            const response = await firstValueFrom(
                this.httpService.get(url, {
                    headers: {
                        'Accept': '*/*',
                        'User-Agent': 'Mozilla/5.0 (compatible; EigenLayerBot/1.0)',
                    },
                    timeout: 10000,
                    maxRedirects: 5,
                    responseType: 'text',
                    validateStatus: status => status < 500 // Accept any status < 500
                })
            );

            if (response.status === 404) {
                throw new Error('Metadata not found');
            }

            try {
                const jsonData = typeof response.data === 'string' 
                    ? JSON.parse(response.data)
                    : response.data;
                return jsonData;
            } catch (parseError) {
                throw new Error('Response is not valid JSON');
            }
        } catch (error) {
            console.error('Error fetching metadata:', error, 'URL:', url);
            if (error instanceof Error) {
                throw new BadRequestException(`Failed to fetch metadata: ${error.message}`);
            }
            throw new BadRequestException('Failed to fetch metadata');
        }
    }
}