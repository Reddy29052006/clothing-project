# Stage 1: Build Vite React application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package config
COPY package.json ./

# Install packages
RUN npm install

# Copy application code
COPY . .

# Pass build-time environment variable for API endpoints
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build client bundle
RUN npm run build

# Stage 2: Run built frontend in production-ready Nginx server
FROM nginx:1.25-alpine

# Copy built static folder from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default Nginx configuration block
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
