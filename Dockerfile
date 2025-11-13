FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build argument for API URL
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the app
RUN npm run build

# Install serve globally for production serving
RUN npm install -g serve

EXPOSE 3000

# Serve the built app with proper MIME types
CMD ["serve", "-s", "dist", "-l", "3000"]
