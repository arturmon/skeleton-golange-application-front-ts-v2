FROM node:20.5.1-buster-slim
LABEL authors="Artur Mudrukh"

ENV NODE_ENV production

WORKDIR /usr/src/app
COPY --chown=node:node . /usr/src/app
RUN npm ci --only=production \
    && npm cache clean --force
USER node

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["npm", "start"]
