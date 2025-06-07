FROM node:20-alpine

WORKDIR /app

# Install build dependencies for Alpine
RUN apk add --no-cache python3 make g++

# Copy package.json and package-lock.json from client folder
COPY client/package*.json ./

# Copy shared folder into /app/shared
COPY shared/ ./shared/

# Clean npm cache and install dependencies
RUN npm cache clean --force
RUN npm install --include=optional
RUN npm install @rollup/rollup-linux-x64-musl --save-optional

# Copy the rest of the client code
COPY client/. .

# Build the application
RUN npm run build

# Install serve to serve the built application
RUN npm install -g serve

# Expose port 5173 (Vite's default)
EXPOSE 5173

# Serve the built application
CMD ["serve", "-s", "dist", "-l", "5173"]
