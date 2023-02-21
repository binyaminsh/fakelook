FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 5002

RUN npm run build 

CMD ["npm", "start"]

