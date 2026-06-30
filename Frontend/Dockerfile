# --- Stage 1: Build stage ---
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first to leverage Docker's caching for dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build-time environment variables for Vite.
# Since Vite embeds VITE_* variables into the bundle at build time,
# we declare them as ARGs so they can be passed during "docker build".
ARG VITE_CORE_SERVICE
ARG VITE_REALTIME_SERVICE

ENV VITE_CORE_SERVICE=${VITE_CORE_SERVICE}
ENV VITE_REALTIME_SERVICE=${VITE_REALTIME_SERVICE}

# Build the React + TypeScript application
RUN npm run build

# --- Stage 2: Serve stage ---
FROM nginx:alpine

# Copy the build outputs (dist) from Stage 1 to Nginx public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration to support SPA routing (React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
