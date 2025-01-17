import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { SubgraphModule } from './subgraph/subgraph.module';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'apps/api/src/schema.gql'),
      playground: true,
      definitions: {
        path: join(process.cwd(), 'apps/api/src/graphql.ts'),
      },
    }),
    SubgraphModule
  ],
})
export class AppModule {} 