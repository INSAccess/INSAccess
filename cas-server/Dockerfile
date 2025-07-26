FROM node:20-alpine

RUN npm install -g cas-server-mock

WORKDIR /app

COPY . .

EXPOSE 3004

CMD ["npx", "cas-server-mock", "--port", "3004", "--database", "./users.json"]
