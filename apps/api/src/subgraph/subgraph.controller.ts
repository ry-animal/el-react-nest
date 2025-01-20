import { Controller, Get, Query } from '@nestjs/common';
import { SubgraphService } from './subgraph.service';

@Controller('subgraph')
export class SubgraphController {
    constructor(private readonly subgraphService: SubgraphService) {}

    @Get('metadata')
    async getMetadata(@Query('url') url: string) {
        return this.subgraphService.fetchMetadata(url);
    }
} 