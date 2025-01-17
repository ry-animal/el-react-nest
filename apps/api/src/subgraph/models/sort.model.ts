import { registerEnumType } from '@nestjs/graphql';

export enum SortField {
  OPERATOR_COUNT = 'operatorCount',
  STRATEGY_COUNT = 'strategyCount',
  STAKER_COUNT = 'stakerCount',
  SLASHING_COUNT = 'slashingCount',
  LAST_UPDATE_TIMESTAMP = 'lastUpdateBlockTimestamp'
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

registerEnumType(SortField, { name: 'SortField' });
registerEnumType(SortDirection, { name: 'SortDirection' }); 