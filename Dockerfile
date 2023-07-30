FROM node:18.17.0
LABEL authors="Artur Mudrukh"

RUN adduser -D -g '' appuser
WORKDIR /usr/src/app 
COPY package*.json ./ 
RUN npm install --only=production 
COPY ./src .src
USER appuser 
EXPOSE 3000 
CMD npm start
