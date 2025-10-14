FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY prisma ./prisma
COPY .env ./

RUN npx prisma generate

COPY .next ./.next
COPY public ./public
COPY next.config.js ./

EXPOSE 3002
CMD ["npm", "start"]

