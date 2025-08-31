FROM node:20-alpine AS build

WORKDIR /app
COPY package.json package-lock.json* ./

RUN npm install --legacy-peer-deps

COPY . .

ENV NODE_OPTIONS="--max_old_space_size=4096"
ENV GENERATE_SOURCEMAP=false

RUN npm run build

FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy React build to Nginx's html folder
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
