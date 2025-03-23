# Usar una imagen base de Node.js
FROM node:16

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de package.json e instalar las dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto de los archivos del frontend
COPY . .

# Exponer el puerto en el que corre la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]