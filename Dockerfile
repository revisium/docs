FROM node:22.11.0-alpine AS builder

WORKDIR /home/app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --ignore-scripts

COPY . .

RUN npm run build

FROM nginx:1.25.3-alpine

COPY --from=builder /home/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template


