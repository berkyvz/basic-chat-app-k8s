FROM node:13.12.0-stretch
RUN mkdir app
WORKDIR app
COPY . .
RUN apt-get update
RUN apt-get install -y curl
RUN npm install
ENTRYPOINT npm run start