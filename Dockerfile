# Stage 1: Builder
# Usamos una imagen ligera de Node.js con Alpine Linux para la compilación
FROM node:20-alpine AS builder

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos TODAS las dependencias (necesarias para compilar TypeScript)
# 'npm ci' es más rápido y confiable para entornos de CI/CD/Docker
RUN npm ci

# Copiamos el código fuente y archivos de configuración necesarios
COPY tsconfig.json ./
COPY src ./src

# Compilamos el proyecto (TS -> JS en /dist)
RUN npm run build

# Stage 2: Runner
# Usamos una imagen limpia y ligera para producción
FROM node:20-alpine AS runner

# Establecemos variables de entorno para optimizar Node.js en producción
ENV NODE_ENV=production

WORKDIR /app

# Copiamos solo los archivos de dependencias
COPY package*.json ./

# Instalamos SOLO las dependencias de producción
# Omitimos devDependencies para reducir drásticamente el peso de la imagen
RUN npm ci --only=production && \
    npm cache clean --force

# Copiamos los artefactos compilados desde el stage builder
COPY --from=builder /app/dist ./dist

# Creamos un usuario no-root por seguridad (buena práctica)
USER node

# Exponemos el puerto de la aplicación
EXPOSE 8080

# Comando de inicio
CMD ["node", "dist/server.js"]
