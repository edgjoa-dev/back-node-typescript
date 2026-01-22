# Antigravity E-commerce Backend

Backend profesional para un e-commerce de tienda de ropa, desarrollado con **Node.js**, **TypeScript** y siguiendo los principios de **Clean Architecture**.

## 🚀 Tecnologías

- **Runtime**: Node.js
- **Lenguaje**: TypeScript
- **Framework Web**: Express.js
- **Base de Datos**: MongoDB (Mongoose)
- **Autenticación**: JWT (JSON Web Tokens)
- **Roles**: RBAC (Admin, Client, Vendedor)
- **Arquitectura**: Clean Architecture / Hexagonal
- **Testing**: Jest + Supertest

## 🏛️ Arquitectura

El proyecto sigue una arquitectura limpia dividida en capas para asegurar la escalabilidad y mantenibilidad:

- **Domain**: Entidades y reglas de negocio (e.g., `User`, `UserRepository`).
- **Application**: Casos de uso de la aplicación (e.g., `RegisterUser`, `LoginUser`).
- **Infrastructure**: Implementaciones concretas (e.g., `MongoUserRepository`, esquemas de Mongoose).
- **Presentation**: Controladores y rutas HTTP.

## 🛠️ Instalación y Uso

### Prerrequisitos

- Node.js (v18+)
- MongoDB Atlas URI o instancia local

### Pasos

1.  **Clonar el repositorio**
2.  **Instalar dependencias**
    ```bash
    npm install
    ```
3.  **Configurar variables de entorno**
    Crea un archivo `.env` en la raíz (o usa los valores por defecto en `src/config/envs.ts`):
    ```env
    PORT=8080
    MONGO_URI=mongodb+srv://...
    JWT_SECRET=tu_secreto_super_seguro
    ```
4.  **Ejecutar en desarrollo**
    ```bash
    npm run dev
    ```

5.  **Ejecutar con Docker**
    Construir la imagen optimizada (Multi-stage build):
    ```bash
    docker build -t antigravity-backend .
    ```
    Ejecutar el contenedor:
    ```bash
    docker run -p 8080:8080 -e MONGO_URI='tu_uri_mongo' -e JWT_SECRET='tu_secreto' antigravity-backend
    ```

## 🧪 Testing

El proyecto cuenta con pruebas de integración para el módulo de autenticación.

```bash
npm test
```

## 📂 Estructura del Proyecto

```
src/
├── config/                 # Configuración de entorno
├── modules/                # Módulos del sistema (Auth, Products, etc.)
│   └── auth/               # Módulo de Autenticación
│       ├── application/    # Casos de uso
│       ├── domain/         # Entidades e interfaces
│       ├── infrastructure/ # Modelos DB y repositorios
│       └── presentation/   # Controladores y rutas
├── shared/                 # Código compartido (Kernel, Errores, Utils)
├── app.ts                  # Configuración de Express
└── server.ts               # Punto de entrada
```

## 🔌 Endpoints Principales

### Auth
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

### Users
- `GET /api/users` - Obtener todos los usuarios (Rol: ADMIN, VENDEDOR)
- `PUT /api/users/:id` - Actualizar usuario (Rol: ADMIN)
- `DELETE /api/users/:id` - Eliminar usuario (Soft Delete) (Rol: ADMIN)
