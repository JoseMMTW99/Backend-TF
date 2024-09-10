#  CLASE 35

FROM node:latest

WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app

# Copia los archivos .env a /app
COPY C35_Cluster_y_Escalabilidad/src/.env /app/.env
COPY C35_Cluster_y_Escalabilidad/src/.env.production /app/.env.production
COPY C35_Cluster_y_Escalabilidad/src/.env.development /app/.env.development

EXPOSE 8000

CMD ["npm", "start"]