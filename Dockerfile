FROM node:23-slim AS clientbuild

WORKDIR /app
COPY /package.json .
COPY /package-lock.json .
RUN npm install

COPY /src/ ./src
COPY /static/ ./static
COPY /svelte.config.js .
COPY /tsconfig.json .
COPY /vite.config.ts .

RUN npm run build

EXPOSE 5173

ENTRYPOINT ["npm", "run", "host"]