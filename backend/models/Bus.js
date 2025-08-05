import mongoose from "mongoose";

const BusSchema = new mongoose.Schema({
  plate_number: { type: String, required: true, unique: true },
  model: { type: String },
  status: {
    type: String,
    enum: ["в пути", "готов", "поломка", "отключён"],
    default: "готов",
  },
  seats_total: { type: Number, required: true },
  disabled_seats: { type: [Number], default: [] },
  route_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Route" }],
  current_driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
});

export default mongoose.model("Bus", BusSchema);
