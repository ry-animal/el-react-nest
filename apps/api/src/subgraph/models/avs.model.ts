import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class AVS {
  @Field()
  id: string;

  @Field()
  owner: string;

  @Field(() => Int)
  operatorCount: number;

  @Field(() => Int)
  operatorSetCount: number;

  @Field(() => Int)
  slashingCount: number;

  @Field(() => Int)
  strategyCount: number;

  @Field(() => Int)
  stakerCount: number;

  @Field()
  metadataURI: string;

  @Field()
  lastUpdateBlockNumber: string;

  @Field()
  lastUpdateBlockTimestamp: string;
}