import express from "express";
import mongoose from "mongoose";
import Bus from "../models/Bus.js";
import { auth, isModerator, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Middleware: Проверка на корректность MongoDB ObjectId
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Некорректный ID" });
  }
  next();
};

// 🔹 Получить список всех автобусов (для таблиц админа/модератора)
router.get("/", async (req, res) => {
  try {
    const buses = await Bus.find().populate("route_id", "name");
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении автобусов", error });
  }
});

// ✅ 🔹 Получить ОДИН автобус по ID маршрута (используется при бронировании)
router.get("/by-route/:routeId", async (req, res) => {
  try {
    const bus = await Bus.findOne({ route_id: req.params.routeId });

    if (!bus) {
      return res
        .status(404)
        .json({ message: "Автобус для маршрута не найден" });
    }

    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении автобуса", error });
  }
});

// 🔹 Получить автобус по ID (для админки)
router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id).populate("route_id", "name");
    if (!bus) return res.status(404).json({ message: "Автобус не найден" });
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении автобуса", error });
  }
});
router.put("/:id/assign-driver", auth, isModerator, async (req, res) => {
  const { driverId } = req.body;
  const bus = await Bus.findByIdAndUpdate(
    req.params.id,
    { current_driver: driverId },
    { new: true }
  );
  res.json(bus);
});

router.put("/:id/disable-seat", auth, isAdmin, async (req, res) => {
  const { seatNumber } = req.body;
  const bus = await Bus.findById(req.params.id);
  if (!bus.disabled_seats.includes(seatNumber)) {
    bus.disabled_seats.push(seatNumber);
    await bus.save();
  }
  res.json(bus);
});

// 🔹 Создание нового автобуса (только для админа и модератора)
router.post("/", auth, isModerator, async (req, res) => {
  const { route_id, total_seats, driver, status } = req.body;

  try {
    const newBus = new Bus({
      route_id,
      total_seats,
      available_seats: total_seats,
      occupied_seats: [],
      driver,
      status,
    });

    await newBus.save();
    res.status(201).json({ message: "Автобус добавлен!", bus: newBus });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при добавлении автобуса", error });
  }
});

// 🔹 Обновление автобуса по ID
router.put("/:id", auth, isModerator, validateObjectId, async (req, res) => {
  try {
    const updated = await Bus.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Автобус не найден" });
    res.json({ message: "Автобус обновлён", bus: updated });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при обновлении автобуса", error });
  }
});

// 🔹 Удаление автобуса (только для администратора)
router.delete("/:id", auth, isAdmin, validateObjectId, async (req, res) => {
  try {
    const deleted = await Bus.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Автобус не найден" });
    res.json({ message: "Автобус удалён" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении автобуса", error });
  }
});

export default router;
