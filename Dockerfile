FROM heroku/nodejs

WORKDIR /app/user

COPY package.json /app/user
RUN npm install

COPY . /app/user

EXPOSE 8080

CMD ["npm", "start"]
