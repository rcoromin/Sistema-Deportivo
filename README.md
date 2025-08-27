## 🗺️ Mapa de Código y Flujo de Autenticación

Este proyecto implementa un sistema de autenticación y dashboard usando React (frontend) y Flask (backend). A continuación se describe el flujo principal desde el login:

### Diagrama de Flujo (Login → Dashboard)

```mermaid
flowchart TD
    A[Usuario ingresa email y contraseña en LoginPage] --> B[AuthContext: login()]
    B --> C[POST /login (Flask backend)]
    C --> D[Verifica usuario y contraseña en MySQL]
    D -- OK --> E[Devuelve datos del usuario]
    D -- Error --> F[Muestra error en LoginPage]
    E --> G[AuthContext guarda usuario en estado y localStorage]
    G --> H[App.tsx detecta usuario y muestra HomePage (dashboard)]
```

### Archivos Clave

- **components/LoginPage.tsx**: Formulario de login, validación y llamada a login del contexto.
- **contexts/AuthContext.tsx**: Lógica de autenticación, login, registro, manejo de usuario y sesión.
- **backend/app.py**: API Flask, rutas `/login` y `/register`, conexión y validación con MySQL.
- **components/HomePage.tsx**: Dashboard mostrado tras login exitoso.
- **App.tsx**: Controla qué vista mostrar según si hay usuario autenticado.

### Resumen del Proceso

1. El usuario ingresa sus credenciales en LoginPage.
2. Se llama a `login()` del AuthContext, que hace un fetch al backend.
3. El backend valida el usuario y contraseña con la base de datos.
4. Si es correcto, responde con los datos del usuario; si no, devuelve error.
5. El AuthContext guarda el usuario y App.tsx muestra el dashboard (HomePage).
6. Si el usuario cierra sesión, se borra el usuario y vuelve a LoginPage.

---
Puedes modificar este flujo para agregar más validaciones, roles o rutas protegidas según tus necesidades.
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/15ypmmppYhxYTTlJNYfWh1tG4_28Xflud

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

## Resumen General del Proyecto

Este es un proyecto de aplicación web completa (full-stack) que utiliza:
- **Frontend:** React con TypeScript y Vite para una experiencia de usuario moderna y rápida.
- **Backend:** Flask (Python) para gestionar la lógica de negocio, la autenticación y la comunicación con la base de datos.
- **Base de Datos:** MySQL para almacenar los datos de los usuarios.

El flujo principal es: un usuario se registra o inicia sesión a través de la interfaz de React, que envía una solicitud al backend de Flask. Flask verifica los datos en la base de datos MySQL y devuelve una respuesta, permitiendo o denegando el acceso al panel principal (dashboard).

---

### Archivos y Procesos Clave

#### 1. Backend (`backend/app.py`)

Este es el cerebro de tu aplicación.
- **Propósito:** Gestionar las peticiones del frontend, interactuar con la base de datos y manejar la lógica de autenticación.
- **Procesos Clave:**
    - **`@app.route('/register', methods=['POST'])`**: Recibe los datos de un nuevo usuario, hashea la contraseña por seguridad (usando `bcrypt`) y lo guarda en la base de datos MySQL.
    - **`@app.route('/login', methods=['POST'])`**: Recibe las credenciales de un usuario, busca el usuario en la base de datos y compara la contraseña hasheada para verificar si es correcta.
    - **`get_db_connection()`**: Función de utilidad para establecer la conexión con tu base de datos MySQL.
    - **`db_config`**: Diccionario donde configuras los detalles de tu base de datos (host, usuario, contraseña, etc.).

#### 2. Frontend - Contexto de Autenticación (`contexts/AuthContext.tsx`)

Este archivo gestiona el estado de autenticación en toda la aplicación de React.
- **Propósito:** Saber si un usuario ha iniciado sesión o no, y proporcionar funciones para `login`, `register` y `logout` a cualquier componente que las necesite.
- **Procesos Clave:**
    - **`AuthProvider`**: Es un componente "envoltorio" que provee el contexto de autenticación a toda la aplicación.
    - **`useState<User | null>(null)`**: Mantiene el estado del usuario actual. Si es `null`, el usuario no ha iniciado sesión.
    - **`useEffect`**: Comprueba si hay datos de usuario guardados en el `localStorage` del navegador cuando la aplicación se carga por primera vez. Esto permite que la sesión persista si recargas la página.
    - **`login`, `register`, `logout`**: Funciones que se comunican con el backend de Flask para realizar las acciones de autenticación y actualizan el estado del usuario y el `localStorage`.
    - **`useAuth`**: Un "hook" personalizado que permite a otros componentes acceder fácilmente al estado y las funciones de autenticación.

#### 3. Frontend - Componente Principal (`App.tsx`)

Este es el punto de entrada de tu aplicación React.
- **Propósito:** Orquestar qué se muestra al usuario.
- **Procesos Clave:**
    - **`<AuthProvider>`**: Envuelve toda la aplicación para que todos los componentes hijos puedan usar el contexto de autenticación.
    - **`MainContent`**: Un componente interno que utiliza `useAuth()` para comprobar si hay un usuario (`user`).
        - Si `user` existe, muestra el `HomePage` (el dashboard).
        - Si `user` no existe, muestra el `LoginPage` o el `RegisterPage` dependiendo del estado `isRegistering`.

#### 4. Frontend - Páginas de Componentes (`components/`)

Estos son los componentes que el usuario ve e interactúa.
- **`LoginPage.tsx`**: Formulario para que el usuario inicie sesión. Llama a la función `login` del `AuthContext`.
- **`RegisterPage.tsx`**: Formulario para que un nuevo usuario se registre. Llama a la función `register` del `AuthContext`.
- **`HomePage.tsx`**: El panel principal o dashboard que se muestra después de un inicio de sesión exitoso.

---

### Flujo de Datos (Ejemplo: Inicio de Sesión)

1.  El usuario introduce su email y contraseña en `LoginPage.tsx` y hace clic en "Iniciar Sesión".
2.  El componente `LoginPage` llama a la función `login` que obtuvo del `AuthContext`.
3.  La función `login` en `AuthContext.tsx` envía una petición `POST` a `http://127.0.0.1:5000/login` (tu backend Flask) con el email y la contraseña.
4.  El backend en `app.py` recibe la petición en la ruta `/login`.
5.  Flask busca el usuario por email en la base de datos MySQL.
6.  Si lo encuentra, `bcrypt` compara la contraseña enviada con la almacenada.
7.  Si coinciden, Flask devuelve los datos del usuario (sin la contraseña) con un código de éxito (200).
8.  De vuelta en `AuthContext.tsx`, la petición `fetch` se resuelve con éxito. Los datos del usuario se guardan en el estado de React y en el `localStorage`.
9.  Como el estado `user` en `App.tsx` ya no es `null`, la aplicación renderiza automáticamente el componente `HomePage`.
