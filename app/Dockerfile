FROM node:22-alpine

WORKDIR /app

COPY app . 
COPY prisma .

RUN npm install
RUN npm run build:ci

EXPOSE 8080

ENV PORT 8080

CMD ["npm", "start"]
