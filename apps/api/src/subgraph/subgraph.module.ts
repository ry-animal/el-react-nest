import { Module } from '@nestjs/common';
import { SubgraphService } from './subgraph.service';
import { SubgraphResolver } from './subgraph.resolver';

@Module({
  providers: [SubgraphService, SubgraphResolver],
})
export class SubgraphModule {} 