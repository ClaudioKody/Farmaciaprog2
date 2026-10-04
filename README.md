# 💊 Sistema de Gestión para Farmacia

Trabajo Práctico – Programación II (IES 9-023)

## 1. Integrantes
- Claudio Pérez
- Tomás Naveda

## 2. Descripción
Mini apalicación web para administrar una farmacia. Permite gestionar **medicamentos**, **categorías** y **empleados** (CRUD completo) y muestra un **dashboard** con la cantidad de registros, obtenida en tiempo real desde el backend.

## 3. Tecnologías utilizadas
| Capa | Tecnologías |
|------|-------------|
| Backend | Python, Flask, Flask-SQLAlchemy, API REST, arquitectura MVC |
| Base de datos | MySQL |
| Frontend | ReactJS (Vite), JavaScript, Material UI, Axios |
| Control de versiones | Git y GitHub |

## 4. Requisitos
- Python 3.10 o superior
- Node.js 18 o superior (incluye npm)
- MySQL 8 (o MariaDB) en ejecución
- Git

## 5. Estructura del proyecto
```
farmacia/
├── backend/                 # API REST (Flask)
│   ├── app.py               # archivo principal: se ejecuta con "python app.py"
│   ├── config.py            # configuración (lee backend/.env)
│   ├── database.py          # conexión a la base de datos (objeto db)
│   ├── models/              # MODELOS: una clase por tabla
│   │   ├── categoria.py
│   │   ├── medicamento.py
│   │   └── empleado.py
│   ├── controllers/         # CONTROLADORES: lógica y validaciones
│   │   ├── categoria_controller.py
│   │   ├── medicamento_controller.py
│   │   ├── empleado_controller.py
│   │   └── dashboard_controller.py
│   ├── routes/              # RUTAS: URL -> función del controlador
│   │   ├── categorias_routes.py
│   │   ├── medicamentos_routes.py
│   │   ├── empleados_routes.py
│   │   └── dashboard_routes.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/                # VISTA: ReactJS + Material UI
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx         # arranque de React y tema de MUI
│       ├── App.jsx          # rutas del frontend
│       ├── api.js           # cliente Axios
│       ├── components/      # Layout, CrudPage, NotifyProvider
│       └── pages/           # Dashboard, Medicamentos, Categorias, Empleados
├── database/
│   └── farmacia_db.sql      # estructura + datos iniciales
├── README.md
└── GUIA_GIT.md
```

### Equivalencia con la estructura de clase (Flask con templates)
| Estructura habitual | En este proyecto | Motivo |
|---|---|---|
| `config/database.py` | `backend/database.py` y `backend/config.py` | La consigna pide un `config.py` dentro de `backend/`. La conexión a la base quedó en `database.py` y los datos de conexión en `config.py`. |
| `models/` | `backend/models/` | Igual. |
| `routes/` | `backend/routes/` | Igual. |
| *(faltaba)* `controllers/` | `backend/controllers/` | Carpeta nueva que pide la consigna (MVC). |
| `templates/` y `static/` | `frontend/` | Acá las pantallas no son HTML de Flask: son React, en una carpeta aparte que consume la API. |
| `app.py` | `backend/app.py` | Igual: se ejecuta con `python app.py`. |

### Cómo viaja una petición (ejemplo: crear un medicamento)
1. En **React**, el usuario completa el formulario y toca *Guardar* (`CrudPage.jsx`).
2. **Axios** (`api.js`) envía `POST /api/medicamentos` con los datos en JSON.
3. La **ruta** (`routes/medicamentos_routes.py`) detecta la URL y el método y llama al controlador.
4. El **controlador** (`controllers/medicamento_controller.py`) valida los datos. Si hay errores, responde `400` con el detalle.
5. Si está todo bien, usa el **modelo** (`models/medicamento.py`) para guardar el registro en **MySQL** y responde `201` con el medicamento creado.
6. React muestra el aviso "✅ Medicamento creado correctamente" y recarga la tabla.

## 6. Configuración de MySQL
1. Iniciar el servidor MySQL.
2. Ejecutar el script (crea la base `farmacia_db`, las tablas y los datos de prueba: 10 medicamentos, 5 categorías, 5 empleados):
   ```bash
   mysql -u root -p < database/farmacia_db.sql
   ```
   (o abrir el archivo en MySQL Workbench y ejecutarlo completo).

## 7. Instalación de dependencias y configuración del backend
```bash
cd backend
python -m venv venv
# Windows:  venv\Scripts\activate
# Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env      # Windows: copy .env.example .env
```
Editar `backend/.env` con el usuario y la contraseña de MySQL.

## 8. Configuración del frontend
```bash
cd frontend
npm install
```
El servidor de desarrollo redirige `/api` a `http://127.0.0.1:5000` (ver `vite.config.js`).

## 9. Cómo ejecutar el proyecto
Se necesitan dos terminales:
```bash
# Terminal 1 - backend (http://127.0.0.1:5000)
cd backend
python app.py

# Terminal 2 - frontend (http://localhost:5173)
cd frontend
npm run dev
```
Abrir http://localhost:5173 en el navegador.

## 10. Endpoints de la API
| Recurso | Métodos |
|---------|---------|
| `/api/medicamentos` | GET, POST |
| `/api/medicamentos/<id>` | GET, PUT, DELETE |
| `/api/categorias` | GET, POST |
| `/api/categorias/<id>` | GET, PUT, DELETE |
| `/api/empleados` | GET, POST |
| `/api/empleados/<id>` | GET, PUT, DELETE |
| `/api/dashboard` | GET (conteos) |

Validaciones: nombre obligatorio, precio > 0, stock ≥ 0, categoría obligatoria y fecha válida (medicamentos); nombre obligatorio y sin duplicados, y no se puede borrar una categoría con medicamentos (categorías); nombre, apellido, DNI (único), email válido y cargo (empleados). Los errores se devuelven como JSON y se muestran con `Alert`/`Snackbar` en el frontend.

## 11. Capturas de pantalla
_Agregar acá capturas del Dashboard, Medicamentos, Categorías y Empleados (carpeta `capturas/`)._

## 12. Distribución general de tareas
_Completar con lo que realmente hizo cada integrante (ejemplo: backend y base de datos / frontend y documentación)._
