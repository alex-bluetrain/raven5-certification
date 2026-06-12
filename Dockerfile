FROM node:16-alpine as builder

WORKDIR /app

# Install app dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install

# Build the source code
COPY . .
RUN yarn build

### Stage 2 (production)
FROM node:16-alpine
WORKDIR /app
COPY package.json .
COPY .env .
RUN yarn install --production=true
COPY --from=builder /app/build ./build
EXPOSE 3000
ENTRYPOINT ["yarn", "run"]

