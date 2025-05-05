FROM node:20 as build

WORKDIR /app

COPY ./package.json ./package.json

RUN yarn install

COPY . .

RUN yarn build

FROM nginx
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
