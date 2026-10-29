# Builds the static site and serves it with nginx. Coolify builds this file;
# see README, "Deploying".

FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
# Analytics are baked in at build time; leave both empty to build without.
ARG NEXT_PUBLIC_UMAMI_SRC=""
ARG NEXT_PUBLIC_UMAMI_ID=""
ENV NEXT_PUBLIC_UMAMI_SRC=$NEXT_PUBLIC_UMAMI_SRC NEXT_PUBLIC_UMAMI_ID=$NEXT_PUBLIC_UMAMI_ID
ARG NEXT_PUBLIC_LINUX_WAITLIST_ENABLED="false"
ARG NEXT_PUBLIC_LINUX_WAITLIST_API_ORIGIN=""
ENV NEXT_PUBLIC_LINUX_WAITLIST_ENABLED=$NEXT_PUBLIC_LINUX_WAITLIST_ENABLED NEXT_PUBLIC_LINUX_WAITLIST_API_ORIGIN=$NEXT_PUBLIC_LINUX_WAITLIST_API_ORIGIN
# Optional: a read-only token, so reading the star count is never rate limited.
# Used for this one step; the served image is the nginx stage below.
ARG GITHUB_TOKEN=""
RUN GITHUB_TOKEN=$GITHUB_TOKEN pnpm build

FROM nginx:1.27-alpine
# The official image fills ${VARS} in /etc/nginx/templates at start and
# writes the results under /etc/nginx, keeping their folders.
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx
# Where Umami is served from, e.g. https://analytics.zephium.app, for the CSP.
ENV UMAMI_ORIGIN=""
# Match the browser's fixed build-time destination in the CSP.
ARG NEXT_PUBLIC_LINUX_WAITLIST_API_ORIGIN=""
ENV LINUX_WAITLIST_API_ORIGIN=$NEXT_PUBLIC_LINUX_WAITLIST_API_ORIGIN
RUN rm /etc/nginx/conf.d/default.conf && apk add --no-cache curl
COPY deploy/templates /etc/nginx/templates
COPY --from=build /app/out /usr/share/nginx/html
# The star count, kept fresh while the site runs (see the script).
COPY --chmod=755 deploy/stars.sh /docker-entrypoint.d/40-stars.sh
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/healthz || exit 1
