FROM node:carbon

WORKDIR /usr/src/docker-react-sample

COPY package*.json ./
COPY . .

EXPOSE 80

#RUN [“npm”, “start”]

CMD ["php", "artisan", "serve"]
