import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import { auth, isAdmin, isModerator } from "../middlewares/authMiddleware.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const router = express.Router();

/**
 * 🔹 Авторизация (логин)
 */
router.post("/login", async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: "Пользователь не найден" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Неверный пароль" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "3h",
    });

    res.json({ token, user });
  } catch (error) {
    console.error("Ошибка при входе:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

/**
 * 🔹 Регистрация нового пользователя
 */
router.post("/register", async (req, res) => {
  const { name, surname, phone, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "Пользователь уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      surname,
      phone,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();
    res.status(201).json({ message: "Пользователь зарегистрирован", user: newUser });
  } catch (error) {
    console.error("Ошибка при регистрации:", error);
    res.status(500).json({ message: "Ошибка при регистрации" });
  }
});

/**
 * 🔹 Получение текущего пользователя с историей поездок
 */
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: "history",
        populate: {
          path: "route_id",
          model: "Route",
          select: "name",
        },
      })
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json(user);
  } catch (error) {
    console.error("Ошибка при загрузке пользователя:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

/**
 * 🔹 Получение всех пользователей (Только админ)
 */
router.get("/", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Ошибка при получении списка пользователей:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

/**
 * 🔹 Обновление пользователя (Только модератор и админ)
 */
router.put("/:id", auth, isModerator, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Ошибка при обновлении пользователя:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

/**
 * 🔹 Удаление пользователя (Только админ)
 */
router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json({ message: "Пользователь удален" });
  } catch (error) {
    console.error("Ошибка при удалении пользователя:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;