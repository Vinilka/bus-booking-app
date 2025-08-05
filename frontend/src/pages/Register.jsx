import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Register.css"; // Создай этот файл или удали строку, если он не нужен

const API_URL = "http://localhost:5000/api/users";

const Register = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        surname,
        phone,
        password,
        role,
      });

      setSuccess("✅ Успешная регистрация! Перенаправление...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>📝 Регистрация</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Фамилия"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="📞 Телефон"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          pattern="[+]*[0-9]{10,15}"
          title="Введите номер в формате +375XXXXXXXXX"
          required
        />
        <input
          type="password"
          placeholder="🔑 Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          title="Минимум 6 символов"
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">Пользователь</option>
          <option value="moderator">Модератор</option>
          <option value="admin">Администратор</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "⏳ Регистрация..." : "Зарегистрироваться"}
        </button>
      </form>

      <p>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
};

export default Register;