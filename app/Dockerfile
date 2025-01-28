FROM node:22-slim

WORKDIR /app

COPY app . 
COPY prisma .

RUN apt-get update && apt-get install -y openssl

RUN npm install
RUN npm run build:ci

EXPOSE 8080

ENV PORT 8080

CMD ["npm", "start"]
