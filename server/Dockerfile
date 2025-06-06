FROM node:20

WORKDIR /app/server

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4001

CMD ["npm", "start"]
