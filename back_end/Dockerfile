#Build
FROM node:20-alpine AS builder
# thư mục làm việc trong container
WORKDIR /app 

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# xóa các dev dependencies
RUN npm prune --production


# runtime
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
# Tự tìm main.js ở dist/ hoặc dist/src/
CMD ["sh", "-c", "if [ -f dist/main.js ]; then node dist/main.js; else node dist/src/main.js; fi"]