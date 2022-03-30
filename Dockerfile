FROM node:12

WORKDIR .
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm","start"]
