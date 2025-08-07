# cas-server/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copier les fichiers
COPY package.json server.js ./

# Installer les dépendances
RUN npm install

EXPOSE 3004

CMD ["npm", "start"]