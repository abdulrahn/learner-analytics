FROM node:18-alpine as angular-builder

WORKDIR /app

copy . .
RUN npm install --force
RUN npm run build 

FROM httpd:alpine

WORKDIR /usr/local/apache2/htdocs/
COPY --from=angular-builder /app/dist/learner-analysics/ .
