FROM node:12
# Create app directory
WORKDIR /usr/src/eid-sync
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8089
ENV TZ Africa/Nairobi
CMD [ "node", "app.js" ]