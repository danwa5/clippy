FROM node:alpine

COPY . /source
WORKDIR /source
RUN yarn install
RUN yarn global add @vue/cli
RUN yarn global add http-server
RUN npx browserslist@latest --update-db
RUN export NODE_OPTIONS=--openssl-legacy-provider && yarn run build

CMD export NODE_OPTIONS=--openssl-legacy-provider && yarn serve --mode production
