# Use the official Node.js image as the base image
FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
# Copying the json file prior to the application code is an optmization technique to ensure
# That steps only run when there is a change in dependencies and not just to any change in code
COPY package*.json ./

# Install the application dependencies
RUN npm i

# Copy the rest of the application files
# This is always confusing but its always <source> <destination> in docker
# When using full copy you can use docker ignore to exclude files
COPY . .

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "dev"]
