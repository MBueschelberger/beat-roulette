FROM node:22.9.0-bookworm-slim

RUN apt update && apt upgrade -y
RUN apt install -y git

WORKDIR /app

COPY . /app

RUN npm install -g @angular/cli

RUN npm install

EXPOSE 4200

ENTRYPOINT ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
