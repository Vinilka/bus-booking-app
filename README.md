# Bus Booking System

## Описание

Bus Booking System — это полнофункциональное веб-приложение для бронирования автобусных билетов. Система поддерживает регистрацию и авторизацию пользователей, просмотр маршрутов, бронирование билетов, а также административные функции для управления автобусами, водителями и маршрутами.

---

## Структура проекта

```
bus-booking/
  backend/      # Серверная часть (Node.js, Express, MongoDB)
  frontend/     # Клиентская часть (React, Vite)
```

### Backend

- **models/** — Модели данных MongoDB (Booking, Bus, Driver, Route, User)
- **middlewares/** — Промежуточные обработчики (например, авторизация)
- **routes/** — Маршруты API для всех сущностей
- **seed.js** — Скрипт для заполнения базы данных начальными данными
- **server.js** — Точка входа, настройка сервера и подключение к БД

### Frontend

- **src/pages/** — Основные страницы приложения (Home, Login, Register, Profile, Booking, AdminPanel и др.)
- **src/components/** — Переиспользуемые компоненты интерфейса (Navbar, Footer и др.)
- **src/services/** — Работа с API
- **src/utils/** — Вспомогательные функции
- **src/styles/** — Глобальные стили
- **main.jsx, index.html** — Точка входа приложения

---

## Быстрый старт

### 1. Клонирование репозитория

```bash
git clone <repo-url>
cd bus-booking
```

### 2. Запуск backend

```bash
cd backend
npm install
npm run seed
npm start
```

### 3. Запуск frontend

```bash
cd frontend
npm install
vite
```

### 4. Открыть приложение

Перейдите в браузере по адресу, указанному в консоли (обычно http://localhost:5173)

---

## Основные возможности

- Регистрация и вход пользователей
- Просмотр и поиск автобусных маршрутов
- Бронирование билетов
- Просмотр истории бронирований
- Административная панель для управления:
  - Автобусами
  - Водителями
  - Маршрутами
  - Пользователями

---

## Описание основных файлов и папок

### Backend

- `models/` — схемы Mongoose для MongoDB
- `middlewares/authMiddleware.js` — проверка JWT-токена пользователя
- `routes/` — обработка API-запросов (CRUD для всех сущностей)
- `server.js` — настройка Express, подключение к MongoDB, запуск сервера

### Frontend

- `src/pages/` — страницы (Home, Login, Register, Profile, Booking, AdminPanel и др.)
- `src/components/` — Navbar, Footer и другие компоненты
- `src/services/` — функции для работы с backend API
- `src/utils/api.js` — настройка HTTP-клиента (например, axios)
- `src/styles/global.css` — глобальные стили

---

## Пример API (backend)

- `POST /api/users/register` — регистрация пользователя
- `POST /api/users/login` — вход пользователя
- `GET /api/routes` — получить список маршрутов
- `POST /api/bookings` — создать бронирование
- `GET /api/bookings` — получить бронирования пользователя

---

## Технологии

- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT
- **Frontend:** React, Vite, CSS

---

## Контакты

Если у вас есть вопросы или предложения, создайте issue или свяжитесь с автором проекта.

---

# Backend File Documentation

## server.js

**Purpose:**
Main entry point for the backend server. Sets up Express, connects to MongoDB, configures middleware, and registers all API routes.

**Key Functions:**

- Loads environment variables
- Connects to MongoDB using Mongoose
- Registers middleware (CORS, JSON parsing)
- Mounts route handlers for users, bookings, routes, buses, and drivers
- Starts the server on the specified port

**Interactions:**

- Imports all route files from `routes/`
- Uses models indirectly via routes
- Loads environment variables from `.env`

---

## seed.js

**Purpose:**
Populates the database with initial test data for routes, buses, drivers, users, and bookings.

**Key Functions:**

- Connects to MongoDB
- Clears existing collections
- Inserts sample data for routes, drivers, buses, users, and bookings
- Hashes passwords for users
- Exits the process after seeding

**Interactions:**

- Imports all models from `models/`
- Uses bcrypt for password hashing
- Loads environment variables from `.env`

---

## package.json

**Purpose:**
Defines backend dependencies, scripts, and project metadata.

**Key Functions:**

- Lists all npm dependencies (express, mongoose, dotenv, etc.)
- Provides scripts for starting and developing the backend

**Interactions:**

- Used by npm/yarn to install dependencies and run scripts

---

## models/Booking.js

**Purpose:**
Defines the Booking schema for MongoDB, representing a ticket reservation.

**Key Functions:**

- Stores references to user, route, and bus
- Contains seat number, stops, status, and date
- Adds timestamps for creation and update

**Interactions:**

- Used in booking logic and user history
- Referenced in booking and user routes

---

## models/Bus.js

**Purpose:**
Defines the Bus schema for MongoDB, representing a bus entity.

**Key Functions:**

- Stores plate number, model, status, total seats, disabled seats
- References routes and current driver

**Interactions:**

- Used in bus management and booking logic
- Referenced in bus and route routes

---

## models/Driver.js

**Purpose:**
Defines the Driver schema for MongoDB, representing a bus driver.

**Key Functions:**

- Stores name, phone, license number, and active status
- References the current bus

**Interactions:**

- Used in driver management and bus assignment
- Referenced in driver and bus routes

---

## models/Route.js

**Purpose:**
Defines the Route schema for MongoDB, representing a bus route.

**Key Functions:**

- Stores route name, stops, departure/arrival times, base price
- References buses assigned to the route

**Interactions:**

- Used in route management and booking logic
- Referenced in route and bus routes

---

## models/User.js

**Purpose:**
Defines the User schema for MongoDB, representing an application user.

**Key Functions:**

- Stores name, surname, phone, password, and role (user, moderator, admin)
- Contains booking history

**Interactions:**

- Used in authentication, authorization, and booking logic
- Referenced in user and booking routes

---

## middlewares/authMiddleware.js

**Purpose:**
Provides authentication and authorization middleware for protected routes.

**Key Functions:**

- `auth`: Verifies JWT token and attaches user info to the request
- `isModerator`: Checks if user has moderator or admin role
- `isAdmin`: Checks if user has admin role

**Interactions:**

- Used in route files to protect endpoints
- Relies on JWT secret from environment variables

---

## routes/routeRoutes.js

**Purpose:**
Handles all API endpoints related to bus routes.

**Key Functions:**

- Search, list, create, update, and delete routes
- Get all stops, available destinations, and routes with bus info
- Uses middleware for authentication and role checks

**Interactions:**

- Uses Route and Bus models
- Uses auth middleware

---

## routes/busRoutes.js

**Purpose:**
Handles all API endpoints related to buses.

**Key Functions:**

- List, get, create, update, and delete buses
- Assign drivers, disable seats
- Uses middleware for authentication and role checks

**Interactions:**

- Uses Bus model
- Uses auth middleware

---

## routes/driverRoutes.js

**Purpose:**
Handles all API endpoints related to drivers.

**Key Functions:**

- List all drivers
- Create new drivers

**Interactions:**

- Uses Driver model

---

## routes/bookingRoutes.js

**Purpose:**
Handles all API endpoints related to bookings.

**Key Functions:**

- List all bookings
- Create new bookings (with seat assignment and user history update)
- Uses authentication middleware

**Interactions:**

- Uses Booking, Bus, and User models
- Uses auth middleware

---

## routes/userRoutes.js

**Purpose:**
Handles all API endpoints related to users and authentication.

**Key Functions:**

- User registration and login (with JWT)
- Get current user info and history
- List, update, and delete users (admin/moderator only)
- Uses authentication and role-check middleware

**Interactions:**

- Uses User model
- Uses auth middleware
- Uses bcrypt and JWT

---

# Frontend File Documentation

## src/pages/Home.jsx

**Purpose:**
Main landing page for searching bus routes and tickets.

**Key Functions:**

- Allows users to select departure, destination, and date
- Fetches available stops and routes from the backend
- Displays search results and allows navigation to booking

**Interactions:**

- Uses axios to communicate with backend API
- Navigates to Booking page on route selection

---

## src/pages/ManageDrivers.jsx

**Purpose:**
Admin/Moderator page for managing bus drivers.

**Key Functions:**

- Lists all drivers
- Provides a form to add new drivers
- Fetches and updates driver data via API

**Interactions:**

- Uses utility functions from `src/utils/api.js`

---

## src/pages/Booking.jsx

**Purpose:**
Page for booking a ticket for a selected route.

**Key Functions:**

- Fetches route and bus data for the selected route
- Allows seat selection and ticket booking
- Sends booking requests to backend

**Interactions:**

- Uses axios for API calls
- Reads route ID from URL params

---

## src/pages/AllRoutes.jsx

**Purpose:**
Displays a list of all available routes with bus information.

**Key Functions:**

- Fetches all routes with bus info from backend
- Displays route details, stops, price, and bus status

**Interactions:**

- Uses axios for API calls

---

## src/pages/ManageBuses.jsx

**Purpose:**
Admin/Moderator page for managing buses.

**Key Functions:**

- Lists all buses and their details
- Allows editing, adding, and deleting buses
- Fetches and updates bus and route data via API

**Interactions:**

- Uses axios for API calls
- Interacts with backend bus and route endpoints

---

## src/pages/AdminRoutes.jsx

**Purpose:**
Admin/Moderator page for managing routes.

**Key Functions:**

- Lists all routes
- Allows deleting routes (admin only)
- Fetches and updates route data via API

**Interactions:**

- Uses axios for API calls
- Interacts with backend route endpoints

---

## src/pages/AdminPanel.jsx

**Purpose:**
Comprehensive admin panel for managing routes and buses.

**Key Functions:**

- Lists, edits, adds, and deletes routes
- Shows which bus is assigned to each route
- Fetches and updates data via API

**Interactions:**

- Uses axios for API calls
- Interacts with backend route and bus endpoints

---

## src/pages/Profile.jsx

**Purpose:**
User profile page displaying personal info and booking history.

**Key Functions:**

- Fetches and displays user data and booking history
- Allows editing profile (admin/moderator)
- Handles logout

**Interactions:**

- Uses axios for API calls
- Interacts with backend user endpoints

---

## src/pages/Login.jsx

**Purpose:**
Login page for user authentication.

**Key Functions:**

- Authenticates user via backend API
- Stores JWT token and user role in localStorage
- Redirects user based on role

**Interactions:**

- Uses axios for API calls
- Navigates to different pages based on user role

---

## src/pages/Register.jsx

**Purpose:**
Registration page for new users.

**Key Functions:**

- Registers new users via backend API
- Handles form validation and feedback
- Redirects to login on success

**Interactions:**

- Uses axios for API calls

---

## src/pages/ModeratorPanel.jsx

**Purpose:**
Panel for moderators to manage routes and bookings (placeholder for future features).

**Key Functions:**

- Displays a message about moderator capabilities
- Placeholder for future management features

**Interactions:**

- None (currently static)

---

## src/components/Navbar.jsx

**Purpose:**
Navigation bar for the application.

**Key Functions:**

- Displays navigation links based on user role and authentication status
- Handles logout

**Interactions:**

- Uses React Router for navigation
- Reads authentication info from localStorage

---

## src/components/Footer.jsx

**Purpose:**
Footer component for the application.

**Key Functions:**

- Displays copyright

**Interactions:**

- None

---

## src/utils/api.js

**Purpose:**
Utility functions for API requests and authentication.

**Key Functions:**

- Provides functions to get drivers, create drivers, and fetch user data
- Handles authentication headers for API requests

**Interactions:**

- Used by pages/components to interact with backend API
