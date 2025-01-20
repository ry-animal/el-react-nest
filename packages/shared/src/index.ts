// Export all functions, types, and constants
export const formatAddress = (address: string, prefixLength = 4, suffixLength = 4): string => {
  if (!address) return '';
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
};

export const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const formatTimestamp = (timestamp: string | number): string => {
  const date = new Date(Number(timestamp) * 1000);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }

  return 'just now';
};

export enum SortField {
  OPERATOR_COUNT = 'operatorCount',
  STRATEGY_COUNT = 'strategyCount',
  STAKER_COUNT = 'stakerCount',
  SLASHING_COUNT = 'slashingCount',
  LAST_UPDATE_TIMESTAMP = 'lastUpdateBlockTimestamp'
}

export type SortDirection = 'asc' | 'desc';

export const CONSTANTS = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  SORT_DIRECTIONS: ['asc', 'desc'] as const
} as const;

export const sortAVSData = (a: any, b: any, field: string, direction: 'asc' | 'desc'): number => {
  const multiplier = direction === 'asc' ? 1 : -1;
  
  switch (field) {
    case 'lastUpdateBlockTimestamp':
      return multiplier * (Number(a[field]) - Number(b[field]));
    case 'operatorCount':
    case 'strategyCount':
    case 'stakerCount':
    case 'slashingCount':
      return multiplier * (a[field] - b[field]);
    default:
      return multiplier * a[field].localeCompare(b[field]);
  }
};

