# EigenLayer AVS Dashboard

A dashboard application for Active Validator Services (AVS) data from EigenLayer's subgraphs.

## Project Structure

```
├── apps
│   ├── api              # NestJS backend
│   │   └── src
│   │       ├── subgraph # GraphQL subgraph integration
│   │       └── tests    # API tests
│   └── web             # React frontend
│       ├── src
│       │   ├── components
│       │   ├── graphql
│       │   └── styles
│       └── tests      # React tests
└── packages
    └── shared          # Shared types and utilities
```

## Features

- Real-time AVS data visualization using Recharts
- Sortable and paginated AVS data table
- Interactive bubble chart showing relationships between:
  - Operator count
  - Strategy count
  - Staker count
  - Slashing incidents
- GraphQL integration with EigenLayer's subgraph

## Getting Started

### Prerequisites

- Node.js >= 16
- pnpm >= 8

### Installation

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

## If dep issues
pnpm clean
pnpm install
pnpm build
pnpm dev
```

### Deployment

The application is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure the following build settings:
   - Build Command: `pnpm build`
   - Output Directory: `apps/web/dist`
   - Install Command: `pnpm install`
3. Deploy!

The application will be available at:

- Frontend: http://localhost:3000
- API: http://localhost:4000
- GraphQL Playground: http://localhost:4000/graphql

## Testing

```bash
# Run all tests
pnpm test

# Run frontend tests
pnpm --filter web test

# Run API tests
pnpm --filter api test
```

### Test Coverage

- Frontend tests cover:

  - Component rendering
  - Data sorting functionality
  - Chart interactions
  - GraphQL integration

- API tests cover:
  - Subgraph service
  - GraphQL resolvers
  - Data transformation

## Technologies

- Frontend:

  - React
  - Apollo Client
  - Recharts
  - TailwindCSS
  - TypeScript

- Backend:
  - NestJS
  - GraphQL
  - RxJS
  - TypeScript

## API Documentation

### GraphQL Endpoint

The main GraphQL endpoint is available at `/graphql` and supports the following queries:

```graphql
query GetAVSData(
  $skip: Int!
  $first: Int!
  $orderBy: String!
  $orderDirection: String!
) {
  avses(
    skip: $skip
    first: $first
    orderBy: $orderBy
    orderDirection: $orderDirection
  ) {
    id
    owner
    operatorCount
    operatorSetCount
    strategyCount
    stakerCount
    slashingCount
    lastUpdateBlockNumber
    lastUpdateBlockTimestamp
    metadataURI
  }
}
```

## License

This project is licensed under the MIT License - see the LICENSE file for details
