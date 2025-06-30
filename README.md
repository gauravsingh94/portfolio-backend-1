# Portfolio Pro Backend

A Node.js backend API for Portfolio Pro, a platform for creating and managing professional portfolios.

## Tech Stack

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Docker

## Database Management

This project uses Prisma ORM for database management. When running with Docker, database migrations will be automatically applied on startup. If you need to manage migrations manually, you can use the following commands:

```bash
# Deploy pending migrations
npm run prisma:migrate

# Reset the database (warning: this will delete all data)
npm run prisma:reset

# Push schema changes without creating a migration
npm run prisma:push

# Open Prisma Studio to manage data
npm run prisma:studio
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Git](https://git-scm.com/)

### Environment Setup

1. Clone the repository
2. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your settings

### Running with Docker (Recommended)

#### Production Mode

```bash
# Build and start containers
npm run docker:up

# Stop containers
npm run docker:down
```

#### Development Mode

```bash
# Build and start containers in development mode
npm run docker:up:dev

# Stop containers
npm run docker:down:dev
```

### Running Locally (Without Docker)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Generate Prisma client:

   ```bash
   npm run prisma:generate
   ```

3. Run database migrations:

   ```bash
   npm run prisma:migrate
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. For production:

   ```bash
   npm run build
   npm run start:prod
   ```

## API Routes

- `GET /`: Welcome message
- `GET /api/users`: User routes
- `GET /api/portfolios`: Portfolio routes

## Database Schema

The application uses PostgreSQL with Prisma ORM. The main models are:

- User: Manages user accounts
- Portfolio: Stores portfolio data

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
