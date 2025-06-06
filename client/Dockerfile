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

# Debug: List the file structure
RUN echo "=== Checking file structure ===" && \
  find src -name "*.jsx" -o -name "*.js" | head -20 && \
  echo "=== Checking specific path ===" && \
  ls -la src/component/hospital_admin/test_booking/ 2>/dev/null || echo "Directory not found"

RUN npm run build

RUN npm install -g serve
EXPOSE 5173
CMD ["serve", "-s", "dist"]
