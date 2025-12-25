# LiTla'StudiO Copilot API Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 7071
CMD ["npm", "start"]