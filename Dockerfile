FROM node:20-alpine as builder

WORKDIR /app
COPY . .

# Enable and install correct Yarn version
RUN corepack enable && corepack prepare yarn@4.9.2 --activate

RUN yarn install
RUN yarn build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
