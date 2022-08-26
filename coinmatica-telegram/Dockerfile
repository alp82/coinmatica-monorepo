FROM node:16-alpine as node-with-python
WORKDIR /app

ENV PYTHONUNBUFFERED=1
RUN apk add --no-cache \
        ca-certificates python3
RUN apk add --no-cache --virtual .build-deps \
        g++ \
        make \
        cmake \
        git \
        gperf \
        libressl-dev \
        zlib-dev \
        zlib-static \
        linux-headers;
RUN ln -sf python3 /usr/bin/python && python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools


# Install dependencies only when needed
FROM node-with-python AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY ./coinmatica-telegram/package.json ./coinmatica-telegram/yarn.lock* ./coinmatica-telegram/package-lock.json* ./coinmatica-telegram/pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Install dependencies only when needed
FROM node-with-python AS deps-shared
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /shared

# Install dependencies based on the preferred package manager
COPY ./shared/package.json ./shared/yarn.lock* ./shared/package-lock.json* ./shared/pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Production image, copy all the files and run next
FROM node-with-python AS runner
ARG COINMATICA_TELEGRAM_PORT
ARG LOGTAIL_TOKEN
ARG MONGO_USER
ARG MONGO_PASS
ARG MONGO_DB
ARG MONGO_URL
ARG REDIS_URL
ARG SOKETI_APP_ID
ARG SOKETI_APP_KEY
ARG SOKETI_APP_SECRET
ARG SOKETI_HOST
ARG SOKETI_PORT

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps-shared /shared/node_modules /shared/node_modules
COPY ./coinmatica-telegram .
COPY ./shared /shared

USER nodejs
EXPOSE ${COINMATICA_TELEGRAM_PORT}
ENV PORT ${COINMATICA_TELEGRAM_PORT}
CMD ["npm", "run", "dev"]
