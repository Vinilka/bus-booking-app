import { useEffect, useState } from "react";
import axios from "axios";
import "./ManageBuses.css";

const BUS_API = "http://localhost:5000/api/buses";
const ROUTE_API = "http://localhost:5000/api/routes";

function ManageBuses() {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [newBus, setNewBus] = useState({
    route_id: "",
    total_seats: 20,
    driver: "",
    status: "Свободен",
  });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    loadBuses();
    loadRoutes();
  }, []);

  // Загрузка автобусов
  const loadBuses = async () => {
    try {
      const res = await axios.get(BUS_API);
      setBuses(res.data);
    } catch (err) {
      console.error("Ошибка загрузки автобусов:", err);
    }
  };

  // Загрузка маршрутов
  const loadRoutes = async () => {
    try {
      const res = await axios.get(ROUTE_API);
      setRoutes(res.data);
    } catch (err) {
      console.error("Ошибка загрузки маршрутов:", err);
    }
  };

  // Обновление данных автобуса
  const handleInputChange = (index, field, value) => {
    const updated = [...buses];
    updated[index] = { ...updated[index], [field]: value };
    setBuses(updated);
  };

  // Сохранение изменений
  const handleSave = async (bus) => {
    if (!bus.route_id || !bus.driver) {
      alert("Выберите маршрут и укажите водителя!");
      return;
    }

    try {
      await axios.put(`${BUS_API}/${bus._id}`, {
        route_id: bus.route_id,
        total_seats: bus.total_seats,
        driver: bus.driver,
        status: bus.status,
      }, { headers });

      console.log("Автобус обновлен:", bus);
      loadBuses();
    } catch (err) {
      console.error("Ошибка при сохранении автобуса:", err);
      alert("Ошибка при сохранении автобуса");
    }
  };

  // Удаление автобуса
  const handleDelete = async (id) => {
    if (!window.confirm("Удалить автобус?")) return;
    try {
      await axios.delete(`${BUS_API}/${id}`, { headers });
      console.log("Автобус удален:", id);
      loadBuses();
    } catch (err) {
      console.error("Ошибка при удалении автобуса:", err);
      alert("Ошибка при удалении автобуса");
    }
  };

  // Обновление значений для нового автобуса
  const handleNewChange = (field, value) => {
    setNewBus({ ...newBus, [field]: value });
  };

  // Добавление нового автобуса
  const handleAddBus = async () => {
    if (!newBus.route_id || !newBus.driver) {
      alert("Выберите маршрут и укажите водителя!");
      return;
    }

    try {
      const res = await axios.post(BUS_API, newBus, { headers });
      console.log("Автобус добавлен:", res.data);
      setNewBus({ route_id: "", total_seats: 20, driver: "", status: "Свободен" });
      loadBuses();
    } catch (err) {
      console.error("Ошибка при добавлении автобуса:", err);
      alert("Ошибка при добавлении автобуса");
    }
  };

  return (
    <div className="manage-buses">
      <h2>🚌 Управление автобусами</h2>

      <table>
        <thead>
          <tr>
            <th>Маршрут</th>
            <th>Водитель</th>
            <th>Мест всего</th>
            <th>Занято</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {buses.map((bus, index) => (
            <tr key={bus._id}>
              <td>
                <select
                  value={bus.route_id}
                  onChange={(e) => handleInputChange(index, "route_id", e.target.value)}
                >
                  <option value="">Выберите маршрут</option>
                  {routes.map((route) => (
                    <option key={route._id} value={route._id}>
                      {route.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  value={bus.driver}
                  onChange={(e) => handleInputChange(index, "driver", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={bus.total_seats}
                  onChange={(e) => handleInputChange(index, "total_seats", e.target.value)}
                />
              </td>
              <td>{bus.occupied_seats.length}</td>
              <td>
                <select
                  value={bus.status}
                  onChange={(e) => handleInputChange(index, "status", e.target.value)}
                >
                  <option>Свободен</option>
                  <option>Готовится</option>
                  <option>В пути</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleSave(bus)}>💾</button>
                <button onClick={() => handleDelete(bus._id)} className="btn-danger">🗑️</button>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <select
                value={newBus.route_id}
                onChange={(e) => handleNewChange("route_id", e.target.value)}
              >
                <option value="">Выберите маршрут</option>
                {routes.map((route) => (
                  <option key={route._id} value={route._id}>
                    {route.name}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <input
                value={newBus.driver}
                onChange={(e) => handleNewChange("driver", e.target.value)}
              />
            </td>
            <td>
              <input
                type="number"
                value={newBus.total_seats}
                onChange={(e) => handleNewChange("total_seats", e.target.value)}
              />
            </td>
            <td>—</td>
            <td>
              <select
                value={newBus.status}
                onChange={(e) => handleNewChange("status", e.target.value)}
              >
                <option>Свободен</option>
                <option>Готовится</option>
                <option>В пути</option>
              </select>
            </td>
            <td>
              <button onClick={handleAddBus}>➕</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ManageBuses;