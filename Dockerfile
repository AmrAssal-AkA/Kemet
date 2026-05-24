FROM node:22-alpine

WORKDIR /app

COPY Back-end/package*.json ./

RUN npm install --omit=dev

COPY Back-end/ .

EXPOSE 8000

CMD ["node", "server.js"]