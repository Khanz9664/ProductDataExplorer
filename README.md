# Product Data Explorer

A full-stack application that scrapes, explores, and tracks product data from World of Books.

## Features

- **Dynamic Scraping**: Extracts navigation, categories, and products on-demand.
- **Product Exploration**: Navigate through a hierarchy of categories and detailed product grids.
- **Detailed Analytics**: View product prices, descriptions, ratings (extracted), and recommendations.
- **History Tracking**: Keep track of recently viewed products.
- **Responsive UI**: Built with Next.js and Tailwind CSS for a premium mobile-responsive experience.
- **Robust Persistence**: PostgreSQL database managed via Prisma ORM.

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, React
- **Backend**: NestJS, Prisma, PostgreSQL
- **Scraping**: Crawlee + Playwright
- **DevOps**: Docker Compose, GitHub Actions (CI/CD)

## Quick Start

1. **Clone the repo**:
   ```bash
   git clone https://github.com/Khanz9664/ProductDataExplorer.git
   cd ProductDataExplorer
   ```

2. **Start Database**:
   ```bash
   docker-compose up -d
   ```

3. **Install & Run**:
   See the [Deployment Guide](./DEPLOYMENT.md) for detailed instructions.

## Documentation

- [Deployment Guide](./DEPLOYMENT.md)
- [Backend API](./backend/README.md)
- [Frontend Guide](./frontend/README.md)
