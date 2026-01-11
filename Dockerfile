FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Create data directory
RUN mkdir -p data

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]