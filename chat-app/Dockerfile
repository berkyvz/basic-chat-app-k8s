FROM node:13.12.0-stretch
RUN mkdir app
WORKDIR app
COPY . .
RUN npm install
ENTRYPOINT npm run start