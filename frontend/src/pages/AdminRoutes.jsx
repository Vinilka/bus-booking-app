import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminRoutes.css"; 

const API_URL = "http://localhost:5000/api/routes";

const AdminRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

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

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить маршрут?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRoutes(); // Обновляем список
    } catch (err) {
      alert("Ошибка при удалении маршрута");
    }
  };

  return (
    <div className="admin-routes-container">
      <h2>🛠️ Управление маршрутами</h2>
      {error && <p className="error">{error}</p>}

      <ul className="route-list">
        {routes.map((route) => (
          <li key={route._id} className="route-card">
            <p><strong>{route.name}</strong></p>
            <p>⏰ {route.departure_time} — {route.arrival_time}</p>
            <p>📍 Остановки: {route.stops.join(" → ")}</p>
            <p>💰 Цена: {route.base_price} BYN</p>

            {["admin", "moderator"].includes(userRole) && (
              <div className="actions">
                <button onClick={() => console.log("Редактировать маршрут:", route._id)}>✏️ Редактировать</button>
                {userRole === "admin" && (
                  <button onClick={() => handleDelete(route._id)} className="btn-danger">
                    🗑️ Удалить
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminRoutes;