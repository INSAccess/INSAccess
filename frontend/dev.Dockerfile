FROM node:20

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

ENV NODE_OPTIONS="--max_old_space_size=4096"

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]