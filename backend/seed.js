import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import Route from "./models/Route.js";
import Bus from "./models/Bus.js";
import Driver from "./models/Driver.js";
import User from "./models/User.js";
import Booking from "./models/Booking.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🟢 MongoDB connected");

    await Promise.all([
      Route.deleteMany(),
      Bus.deleteMany(),
      Driver.deleteMany(),
      User.deleteMany(),
      Booking.deleteMany(),
    ]);

    // Define Naroch child stops
    const narochStops = [
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

    // Route 1: Минск → Молодечно → Нарочь (all Naroch stops)
    const route1_stops = ["Минск", "Молодечно", ...narochStops];
    const route1_back_stops = [
      ...narochStops.slice().reverse(),
      "Молодечно",
      "Минск",
    ];
    // Route 2: Минск → Нарочь (all Naroch stops, no Молодечно)
    const route2_stops = ["Минск", ...narochStops];
    const route2_back_stops = [...narochStops.slice().reverse(), "Минск"];
    // Route 3: Минск → Занарочь
    const route3_stops = ["Минск", "Занарочь"];
    const route3_back_stops = ["Занарочь", "Минск"];

    // Insert routes (both directions)
    const allRoutes = await Route.insertMany([
      {
        name: "Минск — Молодечно — Нарочь",
        stops: route1_stops,
        departure_time: "08:00",
        arrival_time: "12:00",
        base_price: 15,
      },
      {
        name: "Нарочь — Молодечно — Минск",
        stops: route1_back_stops,
        departure_time: "14:00",
        arrival_time: "18:00",
        base_price: 15,
      },
      {
        name: "Минск — Нарочь",
        stops: route2_stops,
        departure_time: "09:00",
        arrival_time: "13:00",
        base_price: 15,
      },
      {
        name: "Нарочь — Минск",
        stops: route2_back_stops,
        departure_time: "15:00",
        arrival_time: "19:00",
        base_price: 15,
      },
      {
        name: "Минск — Занарочь",
        stops: route3_stops,
        departure_time: "10:00",
        arrival_time: "12:30",
        base_price: 10,
      },
      {
        name: "Занарочь — Минск",
        stops: route3_back_stops,
        departure_time: "16:00",
        arrival_time: "18:30",
        base_price: 10,
      },
    ]);

    // Create some buses for these routes
    const buses = await Bus.insertMany([
      {
        plate_number: "AA-1234",
        model: "Mercedes Sprinter",
        status: "готов",
        seats_total: 20,
        disabled_seats: [3, 4],
        route_ids: [allRoutes[0]._id],
        current_driver: null,
      },
      {
        plate_number: "BB-5678",
        model: "VW Crafter",
        status: "готов",
        seats_total: 18,
        disabled_seats: [],
        route_ids: [allRoutes[2]._id],
        current_driver: null,
      },
      {
        plate_number: "CC-9012",
        model: "Ford Transit",
        status: "готов",
        seats_total: 15,
        disabled_seats: [],
        route_ids: [allRoutes[4]._id],
        current_driver: null,
      },
    ]);

    // Generate 30 random users
    const names = [
      "Иван",
      "Мария",
      "Алексей",
      "Ольга",
      "Дмитрий",
      "Елена",
      "Сергей",
      "Анна",
      "Павел",
      "Татьяна",
      "Виктор",
      "Наталья",
      "Артём",
      "Екатерина",
      "Максим",
      "Светлана",
      "Владимир",
      "Юлия",
      "Андрей",
      "Марина",
      "Роман",
      "Галина",
      "Егор",
      "Людмила",
      "Глеб",
      "Вера",
      "Василиса",
      "Валерий",
      "Полина",
      "Геннадий",
      "Ксения",
    ];
    const surnames = [
      "Иванов",
      "Петрова",
      "Сидоров",
      "Кузнецова",
      "Смирнов",
      "Попова",
      "Волков",
      "Соколова",
      "Лебедев",
      "Козлова",
      "Новиков",
      "Морозова",
      "Егоров",
      "Павлова",
      "Соловьёв",
      "Борисова",
      "Фёдоров",
      "Васильева",
      "Михайлов",
      "Степанова",
      "Андреев",
      "Николаева",
      "Макаров",
      "Орлова",
      "Захаров",
      "Виноградова",
      "Громов",
      "Данилова",
      "Денисов",
      "Жукова",
      "Калинина",
    ];

    const users = [];
    for (let i = 0; i < 30; i++) {
      const name = names[i % names.length];
      const surname = surnames[i % surnames.length];
      const phone = `+37529${(1000000 + i).toString().slice(1)}`;
      const password = await bcrypt.hash("test123", 10);
      users.push(
        await User.create({ name, surname, phone, password, role: "user" })
      );
    }

    // Generate 30 random bookings for today, tomorrow, and the day after
    const today = new Date();
    const dateStrings = [
      today.toISOString().slice(0, 10),
      new Date(today.getTime() + 86400000).toISOString().slice(0, 10),
      new Date(today.getTime() + 2 * 86400000).toISOString().slice(0, 10),
    ];
    const allStops = [
      ...route1_stops,
      ...route1_back_stops,
      ...route2_stops,
      ...route2_back_stops,
      ...route3_stops,
      ...route3_back_stops,
    ];
    for (let i = 0; i < 30; i++) {
      const user = users[i];
      // Pick a random route
      const routeIdx = Math.floor(Math.random() * allRoutes.length);
      const route = allRoutes[routeIdx];
      // Pick a bus for the route
      const bus = buses[routeIdx % buses.length];
      // Pick random departure and arrival stops (ensure they are different and in order)
      const stops = route.stops;
      let depIdx = Math.floor(Math.random() * (stops.length - 1));
      let arrIdx =
        depIdx + 1 + Math.floor(Math.random() * (stops.length - depIdx - 1));
      const departure_stop = stops[depIdx];
      const arrival_stop = stops[arrIdx];
      // Pick a random date
      const date = dateStrings[Math.floor(Math.random() * dateStrings.length)];
      // Pick a random seat
      const seat_number = 1 + Math.floor(Math.random() * bus.seats_total);
      await Booking.create({
        user_id: user._id,
        user_name: user.name,
        phone: user.phone,
        route_id: route._id,
        bus_id: bus._id,
        departure_stop,
        arrival_stop,
        seat_number,
        status: "Оплачено",
        date,
      });
    }

    console.log("✅ Test data loaded");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

run();
