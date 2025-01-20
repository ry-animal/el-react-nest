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
  strategyCount: number;

  @Field(() => Int)
  stakerCount: number;

  @Field(() => Int)
  slashingCount: number;

  @Field(() => Int)
  lastUpdateBlockTimestamp: number;

  @Field({ nullable: true })
  metadataURI?: string;
}