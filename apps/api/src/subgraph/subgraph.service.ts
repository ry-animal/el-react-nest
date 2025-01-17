import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SubgraphService {
    private readonly endpoint = 'https://subgraph.satsuma-prod.com/...';

    constructor(private readonly httpService: HttpService) {}

    async getAVSData(skip: number, first: number, orderBy: string, orderDirection: string) {
        const query = `
            query GetAVSData($skip: Int!, $first: Int!, $orderBy: String!, $orderDirection: String!) {
                avses(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
                    id
                    owner
                    operatorCount
                    operatorSetCount
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
                variables: { skip, first, orderBy, orderDirection }
            })
        );

        return response.data.data.avses;
    }
}