# Build Stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production Stage
FROM node:20-alpine
# Chromium dependencies for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    NODE_ENV=production

# Create app directory and non-root user
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

# Copy from build stage and project files
COPY --from=build /app/node_modules ./node_modules
COPY . .

# Create tmp directory for screenshots
RUN mkdir -p /app/tmp && chown -R appuser:appgroup /app/tmp

# Use the non-root user
USER appuser

# Expose application port
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]