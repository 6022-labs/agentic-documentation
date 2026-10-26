
# docker build --build-arg DOCS_URL=https://docs.agentic.6022.io -t agentic-documentation .
# docker run -d -p 80:80 --name agentic-documentation agentic-documentation

FROM node:24-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

ARG DOCS_URL
ENV DOCS_URL=$DOCS_URL

RUN npm run build

# ---

FROM nginx:1.31-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/nginx-markdown.conf /etc/nginx/conf.d/markdown.conf
COPY --from=builder /usr/src/app/build /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
