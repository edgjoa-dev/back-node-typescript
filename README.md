# Antigravity E-commerce Backend

Backend profesional para un e-commerce de tienda de ropa, desarrollado con **Node.js**, **TypeScript** y siguiendo los principios de **Clean Architecture**.

## 🚀 Tecnologías

- **Runtime**: Node.js
- **Lenguaje**: TypeScript
- **Framework Web**: Express.js
- **Base de Datos**: MongoDB (Mongoose)
- **Autenticación**: JWT (JSON Web Tokens)
- **Roles**: RBAC (Admin, Client, Vendedor)
- **CI/CD**: GitHub Actions
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

## 🔄 CI/CD

El proyecto incluye un pipeline de **GitHub Actions** (`.github/workflows/ci.yml`) que se ejecuta en cada Push y Pull Request a `main`.

**Jobs:**
1. **Build & Test**:
    - Levanta una BD MongoDB efímera (Service Container).
    - Instala dependencias y corre el linter/build.
    - Ejecuta `npm run test:ci`.
2. **Docker Verify**:
    - Construye la imagen de Docker para asegurar que el Dockerfile es válido.

## 🚀 Release & Versioning

El proyecto utiliza **Semantic Release** para automatizar el versionado, releases en GitHub, y publicación de imágenes en Docker Hub.

- **Trigger**: Push a la rama `main`.
- **Acciones**:
    1.  Analiza los mensajes de commit (Conventional Commits).
    2.  Calcula la nueva versión (SemVer).
    3.  Actualiza `package.json` y `CHANGELOG.md`.
    4.  Crea un GitHub Release.
    5.  **Docker Hub**: Construye y sube imágenes con tags `vX.Y.Z` y `latest`.

### Configuración Necesaria
Asegúrate de configurar los siguientes **Secrets** en tu repositorio de GitHub:
- `DOCKER_USERNAME`: Tu usuario de Docker Hub.
- `DOCKER_PASSWORD`: Tu contraseña o access token de Docker Hub.
- `GITHUB_TOKEN`: (Automático por GitHub Actions, pero puede requerir permisos).

### 📌 Buenas Prácticas de Commits (Conventional Commits)

Es crucial seguir el estándar de **Conventional Commits** para que Semantic Release determine correctamente el número de versión (Major, Minor, Patch).

| Tipo | Descripción | Efecto en Versión | Ejemplo |
| :--- | :--- | :--- | :--- |
| **feat** | Nueva funcionalidad | **MINOR** (v1.1.0 -> v1.2.0) | `feat: add user registration` |
| **fix** | Corrección de bug | **PATCH** (v1.1.0 -> v1.1.1) | `fix: password validation error` |
| **perf** | Mejora de rendimiento | **PATCH** | `perf: improve api response time` |
| **docs** | Cambios en documentación | Sin cambio de versión | `docs: update readme instructions` |
| **chore**| Tareas de mantenimiento | Sin cambio de versión | `chore: update dependencies` |
| **test** | Tests unitarios/integración | Sin cambio de versión | `test: add integration tests` |
| **BREAKING CHANGE** | Cambio que rompe compatibilidad | **MAJOR** (v1.0.0 -> v2.0.0) | `feat: change api contract (BREAKING CHANGE: remove field X)` |

#### Ejemplos de Mensajes de Commit

```text
feat(auth): add login endpoint with jwt
fix(user): resolve crash when email is missing
docs: add installation steps to readme
chore: update package.json scripts
feat(api): update user response format

BREAKING CHANGE: user response id is now uuid instead of mongo id
```


### Users
- `GET /api/users` - Obtener todos los usuarios (Rol: ADMIN, VENDEDOR)
- `PUT /api/users/:id` - Actualizar usuario (Rol: ADMIN)
- `DELETE /api/users/:id` - Eliminar usuario (Soft Delete) (Rol: ADMIN)
