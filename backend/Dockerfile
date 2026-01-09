FROM node:18-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies including devDependencies for build
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
# Copy node_modules to ensure prisma client is available if needed, or rely on production install
# Note: Prisma client is usually generated into node_modules, so we might need to copy it or regenerate it.
# A ssafer bet for Prisma in prod is to regenerate or copy the generated client.
# Let's simple copy the node_modules from builder if we want to be sure, OR run generate again.
# Running generate is safer for architecture matching if stages differed, but here they are same.
# Let's just copy the built node_modules from builder? No, builder has devDeps.
# Let's regenerate prisma client in prod stage to be safe and clean.

COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma

# Start the application
CMD ["node", "dist/main"]
