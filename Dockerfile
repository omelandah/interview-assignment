FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm run build

COPY . .

EXPOSE 3000

CMD npm run migrate && npm start