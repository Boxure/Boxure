FROM node:24-bullseye
WORKDIR /app
COPY package*.json ./
# No install here
COPY . .
EXPOSE 3000
CMD ["sh", "-lc", "npm install && npm run dev"]
