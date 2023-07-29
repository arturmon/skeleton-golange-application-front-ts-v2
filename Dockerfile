FROM node:18.17.0
  
WORKDIR /usr/src/app 
COPY package*.json ./ 
RUN npm install --only=production 
COPY ./src ./src 
EXPOSE 3000 
CMD npm start
