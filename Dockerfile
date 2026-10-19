FROM mcr.microsoft.com/playwright:v1.64.1-noble

WORKDIR /app

COPY package.json ./
RUN npm install --no-audit --no-fund

COPY . .

CMD ["npx", "playwright", "test"]
