FROM node:alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install --only=production

# Copy the rest of the app files to the working directory
COPY . .

# Expose port 5001
EXPOSE 5001

# Start the app
CMD [ "npm", "start" ]
