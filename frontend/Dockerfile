# FROM node:lts-alpine
# RUN apk add git  # For developing through the container

# WORKDIR /app
# # COPY ./frontend/package*.json ./frontend

# COPY ./frontend .
# RUN npm install


# EXPOSE 3000
# CMD [ "npm", "run", "dev" ]

FROM node:lts-alpine
WORKDIR /frontend
COPY ./frontend .
RUN npm install
RUN npm install npm@latest -g
ENV NODE_OPTIONS=--max_old_space_size=4096
CMD ["npm", "run", "build" ]
