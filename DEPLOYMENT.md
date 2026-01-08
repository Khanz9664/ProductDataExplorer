# Deployment Guide

This guide covers how to deploy the Product Data Explorer capabilities locally and via CI/CD.

## Prerequisites
- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Docker & Docker Compose**: For running the database and Redis services.

## Environment Variables

### Backend (`/backend/.env`)
Create a `.env` file in the `backend` directory:
```bash
# Database Connection (from docker-compose)
DATABASE_URL="postgresql://user:password@localhost:5432/product_explorer?schema=public"

# Optional: Redis (if used for caching)
REDIS_HOST="localhost"
REDIS_PORT=6379
```

### Frontend (`/frontend/.env.local`)
Create a `.env.local` file in the `frontend` directory if needed (currently defaults to localhost:3000):
```bash
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

## Option 1: Local Development with Docker Support

1. **Start Infrastructure Services**
   Run PostgreSQL and Redis using Docker Compose:
   ```bash
   docker-compose up -d
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npx prisma migrate dev  # Initialize/Update Database Schema
   npm run start:dev
   ```
   The backend will be available at `http://localhost:3000`.

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will be available at `http://localhost:3001` (or whichever port Next.js picks).

## Option 2: CI/CD Pipeline

This project includes a GitHub Actions workflow `.github/workflows/ci-cd.yml` that handles automated building and testing.

### Workflow Triggers
- Pushes to `main` calls the `build-and-test` job.
- Pull Requests to `main` calls the `build-and-test` job.

### Workflow Steps
1. **Build & Test**: Installs dependencies and verifies `npm run build` for both Backend and Frontend.
2. **Docker Build**: Builds a Docker image for the backend (demonstration of containerization).

### Deploying to Cloud Providers
- **Railway/Render**: Connect your GitHub repository. These platforms can auto-detect the `backend/package.json` and start the service. ensure you set the `DATABASE_URL` environment variable in their dashboard.
- **Docker**: You can push the image built in the CI/CD pipeline to a registry (Docker Hub/ECR) and deploy it to any container orchestrator (ECS, Kubernetes).

## Troubleshooting

- **Database Connection Error**: Ensure the `postgres` container is running (`docker ps`) and the `DATABASE_URL` matches the credentials in `docker-compose.yml`.
- **Scraper Issues**: The Playwright scraper runs in a headless browser. Ensure dependencies are installed (`npx playwright install-deps` might be needed in some bare-metal Linux environments).
