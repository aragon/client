# Stage 1: Build
FROM node:16-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules (scrypt, secp256k1)
RUN apk add --no-cache python3 make g++ git

# Copy dependency files first for better layer caching
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --network-timeout 120000

# Copy source code (including .env)
COPY . .

# Build the application (outputs to /app/public)
RUN yarn build

# Stage 2: Serve & Export
FROM nginx:alpine

# Copy built files to nginx serving directory
COPY --from=builder /app/public /usr/share/nginx/html

# Also copy to /export for IPFS extraction
RUN cp -r /usr/share/nginx/html /export

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
