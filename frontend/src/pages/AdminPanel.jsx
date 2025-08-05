import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPanel.css";

const ROUTE_API = "http://localhost:5000/api/routes";
const BUS_API = "http://localhost:5000/api/buses";

function AdminPanel() {
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [newRoute, setNewRoute] = useState({
    name: "",
    stops: "",
    departure_time: "",
    arrival_time: "",
    base_price: "",
  });

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");
  const headers = { Authorization: `Bearer ${token}` };

  const canEdit = role === "admin" || role === "moderator";
  const canDelete = role === "admin";

  useEffect(() => {
    loadRoutes();
    loadBuses();
  }, []);

  const loadRoutes = async () => {
    try {
      const res = await axios.get(ROUTE_API);
      setRoutes(res.data);
    } catch (err) {
      console.error("Ошибка при загрузке маршрутов:", err);
    }
  };

  const loadBuses = async () => {
    try {
      const res = await axios.get(BUS_API);
      setBuses(res.data);
    } catch (err) {
      console.error("Ошибка при загрузке автобусов:", err);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...routes];
    updated[index] = {
      ...updated[index],
      [field]: field === "stops" ? value.split(",").map((s) => s.trim()) : value,
    };
    setRoutes(updated);
  };

  const handleSave = async (route) => {
    const payload = {
      name: route.name,
      stops: route.stops,
      departure_time: route.departure_time,
      arrival_time: route.arrival_time,
      base_price: route.base_price,
    };

    try {
      await axios.put(`${ROUTE_API}/${route._id}`, payload, { headers });
      await loadRoutes();
    } catch (err) {
      alert("Ошибка при сохранении изменений");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить маршрут?")) return;
    try {
      await axios.delete(`${ROUTE_API}/${id}`, { headers });
      await loadRoutes();
    } catch (err) {
      alert("Ошибка при удалении маршрута");
      console.error(err);
    }
  };

  const handleNewChange = (field, value) => {
    setNewRoute({ ...newRoute, [field]: value });
  };

  const handleAddRoute = async () => {
    const { name, stops, departure_time, arrival_time, base_price } = newRoute;

    if (!name || !stops || !departure_time || !arrival_time || !base_price) {
      alert("Заполните все поля");
      return;
    }

    const payload = {
      name,
      stops: stops.split(",").map((s) => s.trim()),
      departure_time,
      arrival_time,
      base_price,
    };

    try {
      await axios.post(ROUTE_API, payload, { headers });
      setNewRoute({ name: "", stops: "", departure_time: "", arrival_time: "", base_price: "" });
      await loadRoutes();
    } catch (err) {
      alert("Ошибка при добавлении маршрута");
      console.error(err);
    }
  };

  const getBusByRoute = (routeId) => {
    const bus = buses.find((b) => b.route_id === routeId);
    return bus ? `${bus.driver} | ${bus.status}` : "—";
  };

  return (
    <div className="admin-panel">
      <h2>🛠️ Управление маршрутами</h2>

      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Остановки</th>
            <th>Отправление</th>
            <th>Прибытие</th>
            <th>Цена (BYN)</th>
            <th>Автобус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route, index) => (
            <tr key={route._id}>
              <td>
                <input
                  value={route.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                />
              </td>
              <td>
                <input
                  value={route.stops.join(", ")}
                  onChange={(e) => handleChange(index, "stops", e.target.value)}
                />
              </td>
              <td>
                <input
                  value={route.departure_time}
                  onChange={(e) => handleChange(index, "departure_time", e.target.value)}
                />
              </td>
              <td>
                <input
                  value={route.arrival_time}
                  onChange={(e) => handleChange(index, "arrival_time", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={route.base_price}
                  onChange={(e) => handleChange(index, "base_price", e.target.value)}
                />
              </td>
              <td>{getBusByRoute(route._id)}</td>
              <td>
                {canEdit && <button onClick={() => handleSave(route)}>💾</button>}
                {canDelete && (
                  <button onClick={() => handleDelete(route._id)} className="btn-danger">
                    🗑️
                  </button>
                )}
              </td>
            </tr>
          ))}

          {canEdit && (
            <tr>
              <td>
                <input
                  value={newRoute.name}
                  onChange={(e) => handleNewChange("name", e.target.value)}
                />
              </td>
              <td>
                <input
                  value={newRoute.stops}
                  onChange={(e) => handleNewChange("stops", e.target.value)}
                  placeholder="Минск, Нарочь"
                />
              </td>
              <td>
                <input
                  value={newRoute.departure_time}
                  onChange={(e) => handleNewChange("departure_time", e.target.value)}
                />
              </td>
              <td>
                <input
                  value={newRoute.arrival_time}
                  onChange={(e) => handleNewChange("arrival_time", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={newRoute.base_price}
                  onChange={(e) => handleNewChange("base_price", e.target.value)}
                />
              </td>
              <td>—</td>
              <td>
                <button onClick={handleAddRoute}>➕</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;