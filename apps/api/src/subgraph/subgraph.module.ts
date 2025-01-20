import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SubgraphService } from './subgraph.service';
import { SubgraphResolver } from './subgraph.resolver';
import { SubgraphController } from './subgraph.controller';

@Module({
  imports: [HttpModule],
  providers: [SubgraphService, SubgraphResolver],
  controllers: [SubgraphController],
  exports: [SubgraphService]
})
export class SubgraphModule {} 