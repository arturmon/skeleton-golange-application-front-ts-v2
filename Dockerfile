FROM node:alpine AS build_stage
LABEL authors="Artur Mudrukh"
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.25.2
COPY --from=build_stage /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /var/cache/nginx/client_temp && chown -R nginx:nginx /var/cache/nginx
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ || exit 1
USER nginx
