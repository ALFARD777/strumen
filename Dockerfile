FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY .next ./.next
COPY public ./public
COPY prisma ./prisma
COPY next.config.js ./

EXPOSE 3002
CMD ["npm", "start"]
