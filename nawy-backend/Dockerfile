FROM node:18

WORKDIR /app

# Copy build essentials first
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install --include=dev

# Copy source files
COPY src/ src/

# Build TypeScript
RUN npm run build
COPY .env ./

# Clean source files after build
RUN rm -rf src/

EXPOSE 5000
CMD ["node", "dist/index.js"]