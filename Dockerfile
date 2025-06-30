# Use Node base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json, package-lock.json, and TypeScript config
COPY package*.json tsconfig.json ./
# Install TypeScript globally
RUN npm install -g typescript
# Install dependencies including TypeScript
RUN npm install

# Copy the rest of the code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the TypeScript project
RUN tsc -b

# Expose port (use the port your app listens to)
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]