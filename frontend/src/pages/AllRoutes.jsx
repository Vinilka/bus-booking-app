import { useEffect, useState } from "react";
import axios from "axios";
import "./AllRoutes.css";

const API_URL = "http://localhost:5000/api/routes/with-bus-info";

const AllRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get(API_URL);
      setRoutes(response.data);
    } catch (err) {
      setError("Не удалось загрузить маршруты");
    }
  };

  return (
    <div className="routes-container">
      <h2>📋 Все маршруты</h2>
      {error && <p className="error">{error}</p>}

      <ul className="route-list">
        {routes.map((route) => (
          <li key={route._id} className="route-card">
            <p><strong>{route.name}</strong></p>
            <p>⏰ {route.departure_time} — {route.arrival_time}</p>
            <p>📍 Остановки: {route.stops.join(" → ")}</p>
            <p>💰 Цена: {route.base_price} BYN</p>

            {route.busInfo ? (
              <>
                <p>🧍 Свободных мест: <strong>{route.busInfo.freeSeats}</strong></p>
                <p>🚍 Статус автобуса: <em>{route.busInfo.status}</em></p>
              </>
            ) : (
              <p className="text-red">❌ Автобус не назначен</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllRoutes;