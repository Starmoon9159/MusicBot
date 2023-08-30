FROM node:alpine

WORKDIR /usr/src/musicbot

COPY package*.json ./
RUN npm i discord.js
RUN npm install

COPY . .

CMD [ "node","index.js" ]