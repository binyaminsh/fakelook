# Stage 1 - Build stage
FROM node:alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2 - Production stage
FROM node:alpine
WORKDIR /app
COPY --from=build /app/package*.json ./
RUN npm install --only=production
COPY --from=build /app/dist/ ./dist/
COPY ./dist/config ./config
EXPOSE 5003
CMD [ "npm", "start" ]
