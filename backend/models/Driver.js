import mongoose from "mongoose";

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  license_number: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  current_bus_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    default: null,
  },
});

export default mongoose.model("Driver", DriverSchema);
