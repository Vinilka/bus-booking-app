import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Импорт маршрутов
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API Маршруты
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/drivers", driverRoutes);

// Подключение к MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Подключено к MongoDB"))
  .catch((err) => {
    console.error("❌ Ошибка подключения к MongoDB:", err.message);
    process.exit(1); // Завершаем процесс при неудачном подключении
  });

// Главная страница API
app.get("/", (req, res) => {
  res.send("🚀 API работает!");
});

// Запуск сервера
app.listen(PORT, () => console.log(`✅ Сервер запущен на порту ${PORT}`));
