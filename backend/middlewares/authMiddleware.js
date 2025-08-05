import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// 🔐 Middleware для авторизации
export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Нет токена, авторизация отклонена" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Неверный или просроченный токен" });
  }
};

// 🔐 Проверка роли (модератор или админ)
export const isModerator = (req, res, next) => {
  if (req.user.role === "moderator" || req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Доступ запрещён: нужны права модератора" });
  }
};

// 🔐 Проверка роли (только админ)
export const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Доступ запрещён: нужны права администратора" });
  }
};