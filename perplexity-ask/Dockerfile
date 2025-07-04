FROM node:22.12-alpine AS builder

COPY . /app

WORKDIR /app/perplexity-ask

RUN --mount=type=cache,target=/root/.npm npm install
RUN npm run build

FROM node:22-alpine AS release

WORKDIR /app

COPY --from=builder /app/perplexity-ask/dist ./dist
COPY --from=builder /app/perplexity-ask/package.json .
COPY --from=builder /app/perplexity-ask/package-lock.json .

ENV NODE_ENV=production

RUN npm ci --ignore-scripts --omit-dev

ENTRYPOINT ["node", "dist/index.js"]
