FROM node:18.17.0
LABEL authors="Artur Mudrukh"

RUN adduser -D -g '' appuser
WORKDIR /usr/src/app 
COPY package*.json ./ 
RUN npm install --only=production 
COPY ./src .src
USER appuser
# Add Health Check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:10000/ || exit 1
EXPOSE 3000 
CMD npm start
