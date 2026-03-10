# CRUD-dashboard
Se va realizar un Crud con 3 patrones de diseño.



# 📊 Base de Datos – Gestión de Empleados

# 📘 CRUD de Empleados con Node.js y MySQL

## 🧑‍🎓 Introducción

Este proyecto fue desarrollado para la materia de **Seminario de Sistemas**.  
Consiste en un sistema CRUD (Crear, Leer, Actualizar, Eliminar) de empleados utilizando Node.js y MySQL, aplicando buenas prácticas y patrones de diseño.

La base de datos se llama `gestion_empleados` y contiene tres tablas:

- empleados
- tipos_empleado
- areas

Cada empleado almacena:
- Nombre
- Email
- Salario
- Tipo de empleado
- Área

---

## 🛠️ Tecnologías utilizadas

- Node.js
- Express
- MySQL
- EJS
- CSS
- dotenv
- mysql2

---

## 📁 Estructura del proyecto

/
├── app.js                     # Archivo principal del backend
├── routes/
│   ├── apiRoutes.js            # Rutas API para dashboard y selectores
│   └── empleadoRoutes.js        # Rutas API para CRUD de empleados
├── controllers/
│   ├── empleadoController.js    # Lógica de CRUD (responde con JSON)
│   └── dashboardController.js    # (Antiguo, para EJS - quizás no se usa)
├── models/
│   └── empleadoModel.js         # Modelo con métodos de base de datos
├── config/
│   └── db.js                    # Conexión a MySQL (pool)
├── client/                      # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # Componentes shadcn (card, button, etc.)
│   │   │   ├── EmployeeList.jsx  # Lista de empleados con opciones CRUD
│   │   │   ├── EmployeeForm.jsx   # Formulario de crear/editar
│   │   │   └── Dashboard.jsx      # Dashboard con gráficos
│   │   ├── App.jsx                # Configuración de rutas (React Router)
│   │   ├── main.jsx               # Punto de entrada
│   │   ├── index.css               # Estilos Tailwind
│   │   └── lib/
│   │       └── utils.js            # Utilidad cn para clases condicionales
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── package.json (raíz)           # Dependencias del backend
└── .env                          # Variables de entorno (DB, puerto)
---

## 🧠 Patrones de Diseño Implementados

### 1️⃣ Singleton (config/db.js)

Garantiza que solo exista una conexión a la base de datos durante toda la ejecución de la aplicación.

```javascript
class Database {
    constructor() {
        if (!Database.instance) {
            Database.instance = mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME
            });
        }
        return Database.instance;
    }

## 📁 Tabla: tipos_empleado

Campos:
- id (INT, PK, AUTO_INCREMENT)
- nombre (CHAR)

Datos iniciales:

1 - Administrativo  
2 - Operativo  
3 - Supervisor  

---

## 📁 Tabla: areas

Campos:
- id (INT, PK, AUTO_INCREMENT)
- nombre (CHAR)

Datos iniciales:

1 - Sistemas  
2 - Recursos Humanos  
3 - Logística  

---

## 📁 Tabla: empleados

Campos:
- id (INT, PK, AUTO_INCREMENT)
- nombre (CHAR)
- email (CHAR, UNIQUE)
- salario (DECIMAL)
- fecha_ingreso (DATE)
- tipo_id (INT, FK)
- area_id (INT, FK)

---

## 🔗 Relaciones

- `empleados.tipo_id` → referencia a `tipos_empleado.id`
- `empleados.area_id` → referencia a `areas.id`

---

## 🧠 Descripción del Modelo

Cada empleado pertenece a:
- Un tipo de empleado
- Un área

La base de datos está diseñada bajo principios de normalización y modelo relacional,
permitiendo escalabilidad y mantenimiento profesional.

## 🧠 Descargar librerias

# 1. Crear proyecto React
npm create vite@latest client -- --template react

# 2. Entrar a client
cd client

# 3. Instalar dependencias base
npm install

# 4. Instalar Tailwind v3
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p

# 5. Inicializar shadcn
npx shadcn-ui@latest init
# (responde: default, slate, yes, tailwind.config.js, ./src/components/ui)

# 6. Agregar componentes
npx shadcn-ui@latest add card button

# 7. Instalar recharts
npm install recharts

# 8. Configurar proxy en vite.config.js (editar manualmente)
# 9. Crear Dashboard.jsx (código provisto)
# 10. Modificar App.jsx
# 11. Asegurar index.css
