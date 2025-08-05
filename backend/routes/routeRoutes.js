import express from "express";
import mongoose from "mongoose";
import Route from "../models/Route.js";
import Bus from "../models/Bus.js"; // ⬅️ Добавлено
import { auth, isModerator, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔹 Middleware для проверки корректности ObjectId
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Некорректный ID маршрута" });
  }
  next();
};

// Найти откуда и куда едет автобус
router.get("/search", async (req, res) => {
  const { from, to } = req.query;

  try {
    const routes = await Route.find({
      stops: { $all: [from, to] },
    });

    const filtered = routes.filter((route) => {
      const fromIndex = route.stops.indexOf(from);
      const toIndex = route.stops.indexOf(to);
      return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
    });

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при поиске маршрутов", error });
  }
});

// 🔹 Получить все уникальные остановки из всех маршрутов
router.get("/all-stops", async (req, res) => {
  try {
    const routes = await Route.find();
    const allStops = [...new Set(routes.flatMap((r) => r.stops))];
    res.json(allStops);
  } catch (error) {
    console.error("Ошибка при получении остановок:", error);
    res.status(400).json({ message: "Ошибка получения остановок", error });
  }
});

// 🔹 Получить маршруты с данными об автобусах (новый маршрут)
router.get("/with-bus-info", async (req, res) => {
  try {
    const routes = await Route.find();

    const enrichedRoutes = await Promise.all(
      routes.map(async (route) => {
        const bus = await Bus.findOne({ route_id: route._id });
        return {
          ...route.toObject(),
          busInfo: bus
            ? {
                bus_id: bus._id,
                driver: bus.driver,
                status: bus.status,
                freeSeats: bus.available_seats,
              }
            : null,
        };
      })
    );

    res.json(enrichedRoutes);
  } catch (error) {
    console.error("Ошибка при получении маршрутов с автобусами:", error);
    res.status(500).json({ message: "Ошибка при получении маршрутов", error });
  }
});

// 🔹 Получить допустимые остановки КУДА после выбранной ОТКУДА
router.get("/available-to-stops", async (req, res) => {
  const { from } = req.query;
  if (!from) {
    return res
      .status(400)
      .json({ message: "Не указана остановка отправления" });
  }

  try {
    const routes = await Route.find({ stops: from });

    const toStops = new Set();

    routes.forEach((route) => {
      const fromIndex = route.stops.indexOf(from);
      if (fromIndex !== -1 && fromIndex < route.stops.length - 1) {
        route.stops.slice(fromIndex + 1).forEach((stop) => {
          toStops.add(stop);
        });
      }
    });

    res.json([...toStops]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при получении доступных остановок", error });
  }
});

// 🔹 Получить маршрут по ID
router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ message: "Маршрут не найден" });
    }
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении маршрута", error });
  }
});

// 🔹 Создать маршрут (модератор/админ)
router.post("/", auth, isModerator, async (req, res) => {
  const { name, stops, departure_time, arrival_time, base_price } = req.body;

  try {
    const newRoute = new Route({
      name,
      stops,
      departure_time,
      arrival_time,
      base_price,
    });
    await newRoute.save();
    res.status(201).json({ message: "Маршрут добавлен", route: newRoute });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при создании маршрута", error });
  }
});

// 🔹 Обновить маршрут
router.put("/:id", auth, isModerator, validateObjectId, async (req, res) => {
  try {
    const updatedRoute = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedRoute) {
      return res.status(404).json({ message: "Маршрут не найден" });
    }
    res.json({ message: "Маршрут обновлён", route: updatedRoute });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при обновлении маршрута", error });
  }
});

// 🔹 Удалить маршрут
router.delete("/:id", auth, isAdmin, validateObjectId, async (req, res) => {
  try {
    const deletedRoute = await Route.findByIdAndDelete(req.params.id);
    if (!deletedRoute) {
      return res.status(404).json({ message: "Маршрут не найден" });
    }
    res.json({ message: "Маршрут удалён", route: deletedRoute });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении маршрута", error });
  }
});

export default router;
