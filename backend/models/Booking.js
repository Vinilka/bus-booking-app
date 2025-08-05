import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    }, // ❗ Необязательный
    user_name: { type: String }, // 👤 Для незарегистрированных
    phone: { type: String }, // 📞 Телефон пассажира

    route_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    bus_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },

    departure_stop: { type: String, required: true },
    arrival_stop: { type: String, required: true },
    seat_number: { type: Number, required: true },

    status: {
      type: String,
      enum: ["Оплачено", "Не оплачено", "Отменено"],
      default: "Не оплачено",
    },
    date: { type: String, required: true },
  },
  { timestamps: true }
); // добавляет createdAt / updatedAt

const NAROCH_CHILD_STOPS = [
  "деревня Нарочь",
  "Вокзал Нарочь",
  "Санаторий Нарочь",
  "Санаторий Белая Русь",
  "Санаторий Нарочанский Берег",
  "санаторий Приозерный",
  "санаторий Спутник",
  "Зубренок",
  "санаторий Сосны",
  "санаторий Нарочанка",
];

export default mongoose.model("Booking", BookingSchema);
