FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm i @reach/combobox --legacy-peer-deps

COPY . ./

EXPOSE 3000

CMD ["npm", "start"]

