import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Booking.css";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

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

const API_URL = "http://localhost:5000/api";

function Booking() {
  const { routeId } = useParams();
  const [route, setRoute] = useState(null);
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [departureStop, setDepartureStop] = useState("");
  const [arrivalStop, setArrivalStop] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadRouteAndBuses();
    // Reset stop selections when route changes
    setDepartureStop("");
    setArrivalStop("");
  }, [routeId]);

  const loadRouteAndBuses = async () => {
    try {
      const routeRes = await axios.get(`${API_URL}/routes/${routeId}`);
      setRoute(routeRes.data);

      const busRes = await axios.get(`${API_URL}/buses/by-route/${routeId}`);
      const busesData = Array.isArray(busRes.data) ? busRes.data : [];

      if (busesData.length === 0) {
        setMessage("❌ Автобусы для этого маршрута не найдены");
      } else {
        setBuses(busesData);
        setSelectedBus(busesData[0]);
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setMessage("❌ Ошибка при загрузке маршрута или автобусов");
    } finally {
      setLoading(false);
    }
  };

  const bookTicket = async () => {
    if (selectedSeat === null || !selectedBus) {
      setMessage("⚠️ Выберите место и автобус!");
      return;
    }
    if (!departureStop || !arrivalStop) {
      setMessage("⚠️ Выберите остановки!");
      return;
    }
    if (departureStop === arrivalStop) {
      setMessage("⚠️ Остановки отправления и прибытия не могут совпадать!");
      return;
    }
    try {
      await axios.post(
        `${API_URL}/bookings`,
        {
          route_id: routeId,
          bus_id: selectedBus._id,
          seat_number: selectedSeat,
          departure_stop: departureStop,
          arrival_stop: arrivalStop,
          date: new Date().toISOString().split("T")[0],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(`✅ Билет успешно забронирован! Место: ${selectedSeat + 1}`);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Ошибка при бронировании билета"
      );
    }
  };

  // Dynamically build allStops from route.stops, grouping Naroch children
  const allStops = route
    ? route.stops.map((stop) => ({
        label: stop,
        value: stop,
        group: NAROCH_CHILD_STOPS.includes(stop) ? "Нарочь" : "Города",
      }))
    : [];

  return (
    <div className="booking-container">
      <h2 className="text-2xl font-bold text-center mb-4">
        🚌 Бронирование билетов
      </h2>

      {loading ? (
        <p className="loading">⏳ Загрузка...</p>
      ) : route && selectedBus ? (
        <>
          <p className="text-lg">
            <strong>Маршрут:</strong> {route.name} <br />
            <strong>Отправление:</strong> {route.departure_time} <br />
            <strong>Цена билета:</strong> {route.base_price} BYN
          </p>

          <div>
            <label>Остановкa отправления:</label>
            <Autocomplete
              options={allStops}
              groupBy={(option) => option.group}
              getOptionLabel={(option) => option.label}
              value={
                allStops.find((opt) => opt.value === departureStop) || null
              }
              onChange={(_, newValue) =>
                setDepartureStop(newValue ? newValue.value : "")
              }
              renderInput={(params) => (
                <TextField {...params} label="Остановкa отправления" />
              )}
            />
          </div>
          <div>
            <label>Остановкa прибытия:</label>
            <Autocomplete
              options={allStops}
              groupBy={(option) => option.group}
              getOptionLabel={(option) => option.label}
              value={allStops.find((opt) => opt.value === arrivalStop) || null}
              onChange={(_, newValue) =>
                setArrivalStop(newValue ? newValue.value : "")
              }
              renderInput={(params) => (
                <TextField {...params} label="Остановкa прибытия" />
              )}
            />
          </div>

          {buses.length > 1 && (
            <div className="bus-selector">
              <label>Выберите автобус:</label>
              <select
                value={selectedBus._id}
                onChange={(e) => {
                  const found = buses.find((b) => b._id === e.target.value);
                  setSelectedBus(found);
                  setSelectedSeat(null);
                }}
              >
                {buses.map((bus) => (
                  <option key={bus._id} value={bus._id}>
                    {bus.driver} | {bus.status} | мест: {bus.total_seats}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="bus-layout">
            {Array.from({ length: selectedBus.total_seats }).map((_, index) => (
              <button
                key={index}
                className={`seat ${selectedSeat === index ? "selected" : ""} ${
                  selectedBus.occupied_seats.includes(index) ? "occupied" : ""
                }`}
                disabled={selectedBus.occupied_seats.includes(index)}
                onClick={() => setSelectedSeat(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button onClick={bookTicket} className="btn-primary mt-3">
            Забронировать
          </button>

          {message && <p className="message">{message}</p>}
        </>
      ) : (
        <p className="error">{message || "❌ Данные не найдены"}</p>
      )}
    </div>
  );
}

export default Booking;
