FROM node:14

# Set the working directory inside the container
WORKDIR /app/fawwaz-api

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your NestJS application is listening on (default is 3000)
EXPOSE 3000

# Install MySQL client
RUN apt-get update && apt-get install -y mysql-client

# Start the NestJS application
CMD ["npm", "run", "start:prod"]