import { gql } from '@apollo/client';

export const GET_AVS_DATA = gql`
  query GetAVSData {
    getAVSData {
      id
      owner
      operatorCount
      operatorSetCount
      slashingCount
      strategyCount
      stakerCount
      metadataURI
      lastUpdateBlockNumber
      lastUpdateBlockTimestamp
    }
  }
`;
