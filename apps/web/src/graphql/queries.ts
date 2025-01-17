import { gql } from '@apollo/client';

export const GET_AVS_DATA = gql`
  query GetAVSData($skip: Int!, $first: Int!, $orderBy: String!, $orderDirection: String!) {
    getAVSData(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      owner
      operatorCount
      strategyCount
      stakerCount
      slashingCount
      lastUpdateBlockTimestamp
      metadataURI
    }
  }
`;
