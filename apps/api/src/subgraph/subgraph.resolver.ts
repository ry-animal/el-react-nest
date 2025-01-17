import { Resolver, Query } from '@nestjs/graphql';
import { SubgraphService } from './subgraph.service';
import { AVS } from './models/avs.model';

@Resolver(() => AVS)
export class SubgraphResolver {
  constructor(private readonly subgraphService: SubgraphService) {}

  @Query(() => [AVS], { name: 'getAVSData' })
  async getAVSData(): Promise<AVS[]> {
    try {
      const data = await this.subgraphService.getAVSData();
      console.log('Resolver Data:', data);
      return data || [];
    } catch (error) {
      console.error('Resolver Error:', error);
      throw error;
    }
  }
}