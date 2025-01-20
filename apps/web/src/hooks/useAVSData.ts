import { useQuery } from '@tanstack/react-query';
import { AVS } from '../types/avs';

interface AVSQueryParams {
  skip: number;
  first: number;
  orderBy: string;
  orderDirection: string;
}

const fetchAVSData = async ({ skip, first, orderBy, orderDirection }: AVSQueryParams) => {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
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
      `,
      variables: { skip, first, orderBy, orderDirection },
    }),
  });

  const data = await response.json();
  return data.data.getAVSData as AVS[];
};

export const useAVSData = (params: AVSQueryParams) => {
  return useQuery({
    queryKey: ['avs', params],
    queryFn: () => fetchAVSData(params),
  });
}; 