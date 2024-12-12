FROM node:22.12.0

RUN npm install -g npm@10.9.2

RUN mkdir -p /usr/src/app /usr/src/app/server /usr/src/app/client

WORKDIR /usr/src/app/server
COPY server/package.json .
COPY server/package-lock.json .
RUN npm install

WORKDIR /usr/src/app/client
COPY client/package.json .
COPY client/package-lock.json .
RUN npm install

WORKDIR /usr/src/app
COPY . .

WORKDIR /usr/src/app/client
RUN npm run build

WORKDIR /usr/src/app/server

EXPOSE 3001

CMD [ "node", "index.js" ]
