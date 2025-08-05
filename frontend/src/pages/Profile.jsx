import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Вы не авторизованы. Войдите в систему.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      setError("Ошибка при загрузке данных пользователя");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const handleEditProfile = async () => {
    const newName = prompt("Введите новое имя:", user.name);
    if (!newName) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/users/${user._id}`,
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
      alert("Имя обновлено!");
    } catch (error) {
      alert("Ошибка при обновлении.");
    }
  };

  if (loading) return <p className="loading">⏳ Загрузка...</p>;
  if (error) return <p className="error">❌ {error}</p>;

  return (
    <div className="profile-container">
      <h2 className="text-2xl font-bold">👤 Личный кабинет</h2>
      <p><strong>Имя:</strong> {user.name}</p>
      <p><strong>Фамилия:</strong> {user.surname}</p>
      <p><strong>Телефон:</strong> {user.phone}</p>
      <p><strong>Роль:</strong> {user.role}</p>

      <div className="button-group">
        {(user.role === "admin" || user.role === "moderator") && (
          <button onClick={handleEditProfile} className="btn-primary">✏️ Изменить данные</button>
        )}
        <button onClick={handleLogout} className="btn-danger">🚪 Выйти</button>
      </div>

      <h3 className="text-xl mt-4">📦 Личный список бронирований</h3>
      {user.history.length > 0 ? (
        <ul className="history-list">
          {user.history.map((trip, index) => (
            <li key={index}>
              📅 <strong>{trip.date}</strong> | {trip.route?.name || "Маршрут удалён"} | Место: {trip.seat}
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-history">❌ У вас ещё нет поездок.</p>
      )}
    </div>
  );
}

export default Profile;