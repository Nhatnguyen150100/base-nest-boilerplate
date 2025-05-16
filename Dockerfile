# -------- STAGE 1: Base with pnpm installed ----------
FROM node:lts-alpine AS base
WORKDIR /app
RUN npm install -g pnpm@latest
RUN npm install -g husky@latest

# -------- STAGE 2: Build the app ---------------------
FROM base AS build
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm build

# -------- STAGE 3: Production-only dependencies ------
FROM base AS prod_deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

# -------- STAGE 4: Runtime image ---------------------
FROM node:lts-alpine AS runner

ARG PORT=8080
ENV PORT=$PORT
ENV NODE_ENV=production

COPY --from=build /app/build ./build
COPY --from=prod_deps /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-lock.yaml ./pnpm-lock.yaml


EXPOSE $PORT

CMD ["node", "build/src/main"]
