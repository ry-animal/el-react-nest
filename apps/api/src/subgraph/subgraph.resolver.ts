import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { SubgraphService } from './subgraph.service';
import { AVS } from './models/avs.model';

@Resolver(() => AVS)
export class SubgraphResolver {
  constructor(private readonly subgraphService: SubgraphService) {}

  @Query(() => [AVS], { name: 'getAVSData' })
  async getAVSData(
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('first', { type: () => Int, defaultValue: 10 }) first: number,
    @Args('orderBy', { type: () => String, defaultValue: 'lastUpdateBlockTimestamp' }) orderBy: string,
    @Args('orderDirection', { type: () => String, defaultValue: 'desc' }) orderDirection: string,
  ): Promise<AVS[]> {
    return this.subgraphService.getAVSData(skip, first, orderBy, orderDirection);
  }
}