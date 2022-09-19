FROM node:alpine
COPY . /app
WORKDIR /app
CMD npm install
CMD node app.js