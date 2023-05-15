FROM node:12.17.0-alpine
WORKDIR /usr
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY src ./src
COPY firebase ./firebase
COPY public ./public
COPY .env ./
RUN ls -a

RUN npm run postinstall

EXPOSE 5000
CMD ["npm","run","start:prod"]


