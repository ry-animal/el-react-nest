import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { SubgraphService } from './subgraph.service';
import { AVS } from './models/avs.model';

@Resolver(() => AVS)
export class SubgraphResolver {
  constructor(private readonly subgraphService: SubgraphService) {}

  @Query(() => [AVS], { name: 'getAVSData' })
  async getAVSData(
    @Args('skip', { type: () => Int }) skip: number,
    @Args('first', { type: () => Int }) first: number,
    @Args('orderBy', { type: () => String }) orderBy: string,
    @Args('orderDirection', { type: () => String }) orderDirection: string,
  ): Promise<AVS[]> {
    return this.subgraphService.getAVSData(skip, first, orderBy, orderDirection);
  }
}