FROM node:20-alpine3.18

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .
# RUN npm run build
EXPOSE 3000

# CMD ["npm", "run", "dev"]

# For production
CMD ["npm", "run", "start"]

#  create postgres container
# docker run --name postgres -e POSTGRES_PASSWORD=ARv-D~}0q`G5$1K`+#2d -d -p 5432:5432 postgres
