FROM node:20.11.1

WORKDIR /app

COPY package.json package-lock.json
COPY prisma ./prisma
COPY . .

RUN npm install
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]