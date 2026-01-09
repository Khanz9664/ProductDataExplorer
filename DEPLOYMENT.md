# Deployment Guide

This guide covers how to deploy the Product Data Explorer capabilities locally and via CI/CD, with a focus on **Free Tier** deployment options.

## Prerequisites
- **GitHub Account**: To host the repository.
- **Vercel Account**: For Frontend hosting.
- **Render.com Account**: For Backend hosting (Web Service + Database).
- **Supabase/Neon Account** (Optional): For an alternative free PostgreSQL database.

## 1. Setup Database (Free PostgreSQL)

You need a cloud PostgreSQL database.
**Recommendation**: [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com). Both offer excellent free tiers.

1. Create a project on Neon/Supabase.
2. Get the **Connection String** (Postgres URL).
   - Format: `postgres://user:password@host:5432/dbname?sslmode=require`
   - **Important**: For Prisma, you might need the connection string with `pgbouncer=true` if using connection pooling, but direct connection usually works fine for low traffic.

## 2. Deploy Backend (NestJS) to Render.com

Render offers a free tier for Web Services.

1. **Dashboard**: Go to [dashboard.render.com](https://dashboard.render.com).
2. **New Web Service**: Click "New +" -> "Web Service".
3. **Repository**: Connect your GitHub repo `Khanz9664/ProductDataExplorer`.
4. **Settings**:
   - **Root Directory**: `backend` (Important!)
   - **Runtime**: **Docker** (Crucial: Do not select "Node")
   - **Environment Variables**:
     - `DATABASE_URL`: (Paste your Neon/Supabase connection string here)
5. **Deploy**: Click "Create Web Service".
   - *Note*: The free tier spins down after inactivity. It might take 50s to wake up on the first request.

**Capture the URL**: Once deployed, copy your backend URL (e.g., `https://product-explorer-api.onrender.com`).

## 3. Deploy Frontend (Next.js) to Vercel

Vercel is the creators of Next.js and offers the best free hosting.

1. **Dashboard**: Go to [vercel.com](https://vercel.com).
2. **Add New Project**: Import your `Khanz9664/ProductDataExplorer` repo.
3. **Configure Project**:
   - **Root Directory**: Select `frontend` (Click "Edit" next to Root Directory).
   - **Framework Preset**: Next.js (Auto-detected).
   - **Environment Variables**:
     - `NEXT_PUBLIC_API_URL`: (Paste your Render Backend URL, e.g., `https://product-explorer-api.onrender.com`)
       - *Note*: Ensure no trailing slash `/` at the end if your code appends paths like `/products`.
4. **Deploy**: Click "Deploy".

## 4. Final Configuration

1. **CORS**: If you encounter CORS errors on the frontend:
   - Update your NestJS `main.ts` to allow the Vercel domain.
   - Or set `cors: true` / specific origin in `NestFactory.create`.
   - Redeploy Backend if you changed code.

## Local Development with Docker

1. **Start Infrastructure**: `docker-compose up -d` (Postgres + Redis)
2. **Backend**: `cd backend && npm run start:dev`
3. **Frontend**: `cd frontend && npm run dev`

## CI/CD Pipeline

The `.github/workflows/ci-cd.yml` file automates:
- **Build & Test**: Runs on every push to `main` to ensure code quality.
- **Docker Build**: Verifies the backend container can be built.

