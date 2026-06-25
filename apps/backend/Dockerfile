FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install development dependencies for Prisma
RUN npm install

# Copy application files
COPY . .

# Create uploads folder if not exists
RUN mkdir -p uploads

# Expose backend port
EXPOSE 5001

ENV NODE_ENV=production
ENV PORT=5001

CMD ["node", "server.js"]
