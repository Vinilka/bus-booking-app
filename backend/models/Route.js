import mongoose from "mongoose";

const RouteSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Название маршрута (например, "Минск — Нарочь")
  stops: [{ type: String }], // Остановки (список)
  departure_time: { type: String, required: true }, // Время отправления
  arrival_time: { type: String, required: true }, // Время прибытия
  base_price: { type: Number, required: true }, // Базовая цена билета
  bus_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bus" }],
});

export default mongoose.model("Route", RouteSchema);
