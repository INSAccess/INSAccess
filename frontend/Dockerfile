# Stage 1 : Build dependencies
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm install --timeout=300000 # || npm ci --omit=dev --timeout=60000
    

# Stage 2 : Dev
FROM node:20-alpine AS development

RUN apk add --no-cache curl

WORKDIR /app

# Copier package.json depuis l'app
COPY --from=deps /app/node_modules ./node_modules

COPY . .

ENV NODE_OPTIONS="--max_old_space_size=4096"

ENV GENERATE_SOURCEMAP=false

EXPOSE 3000

CMD ["npm", "start"]