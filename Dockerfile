FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
RUN apk add --no-cache curl
COPY docker-entrypoint.d/35-catan-echo-host.sh /docker-entrypoint.d/
# Strip CRLF if built from Windows checkout; entrypoint skips non-runnable scripts silently
RUN sed -i 's/\r$//' /docker-entrypoint.d/35-catan-echo-host.sh \
  && chmod +x /docker-entrypoint.d/35-catan-echo-host.sh
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
