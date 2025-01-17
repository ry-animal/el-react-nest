# EigenLayer AVS Dashboard

A simple dashboard application that displays Active Validator Services (AVS) data from EigenLayer's testnet subgraph. Built with React, NestJS, and GraphQL.

## Features

- Displays a list of Active Validator Services
- Shows key metrics for each AVS:
  - Operator count
  - Strategy count
  - Staker count
  - Slashing count
- Links to metadata URIs when available
- Real-time timestamp formatting
- Responsive table design
- Mobile-friendly with horizontal scroll

## Project Structure

```text
apps/
├── api/ # NestJS GraphQL API
│ ├── src/
│ │ ├── subgraph/ # Subgraph service and resolvers
│ │ └── app.module.ts
│ └── package.json
├── web/ # React Frontend
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── graphql/ # Apollo client and queries
│ │ └── types/ # TypeScript definitions
│ └── package.json
└── shared/ # Shared utilities (TBD)
```

## Tech Stack

- Frontend:

  - React with TypeScript
  - Apollo Client
  - Tailwind CSS
  - Vite

- Backend:
  - NestJS
  - GraphQL
  - Apollo Server

## Getting Started

1. Install dependencies:

- `pnpm install`

2. Run the development server:

- `pnpm dev`

3. Access the React application at `http://localhost:3000`

4. Access the Nest application at `http://localhost:3001/` for health check

5. Access the GraphQL playground at `http://localhost:3001/graphql`

6. Access the Subgraph at `https://subgraph.satsuma-prod.com/027e731a6242/eigenlabs/eigen-graph-testnet-holesky/api`

## Environment Variables

None required as the subgraph endpoint is publicly available.

## Contributing

This is a demo project for the EigenLayer team.

## License

Private - All Rights Reserved
