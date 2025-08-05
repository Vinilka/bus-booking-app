import express from "express";
import Booking from "../models/Booking.js";
import Bus from "../models/Bus.js";
import User from "../models/User.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔹 Получение всех бронирований
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user_id", "name surname phone")
      .populate("route_id", "name")
      .populate("bus_id", "driver status");
    res.json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при получении бронирований", error });
  }
});

// 🔹 Создание нового бронирования
router.post("/", auth, async (req, res) => {
  const { route_id, bus_id, departure_stop, arrival_stop, seat_number, date } =
    req.body;
  const user_id = req.user.id;

  try {
    const bus = await Bus.findById(bus_id);
    if (!bus) {
      return res.status(404).json({ message: "Автобус не найден" });
    }

    if (bus.occupied_seats.includes(seat_number)) {
      return res.status(400).json({ message: "Это место уже занято" });
    }

    bus.occupied_seats.push(seat_number);
    bus.available_seats--;
    await bus.save();

    const newBooking = new Booking({
      user_id,
      route_id,
      bus_id,
      departure_stop,
      arrival_stop,
      seat_number,
      date,
      status: "Оплачено",
    });

    await newBooking.save();

    await User.findByIdAndUpdate(user_id, {
      $push: { history: newBooking._id },
    });

    res
      .status(201)
      .json({ message: "Бронирование успешно!", booking: newBooking });
  } catch (error) {
    console.error("Ошибка при бронировании:", error);
    res.status(500).json({ message: "Ошибка при бронировании", error });
  }
});

// Receiving bookings by date
router.get("/by-date", async (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ message: "No date provided" });
  }
  try {
    const bookings = await Booking.find({ date })
      .populate("user_id", "name surname phone")
      .populate("route_id", "name");
    const result = bookings.map((b) => ({
      name: b.user_id
        ? `${b.user_id.name || ""} ${b.user_id.surname || ""}`.trim()
        : b.user_name || "",
      phone: b.user_id ? b.user_id.phone : b.phone,
      departure_stop: b.departure_stop,
      arrival_stop: b.arrival_stop,
      status: b.status,
      date: b.date,
      createdAt: b.createdAt,
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error getting bookings by date", error });
  }
});

export default router;
