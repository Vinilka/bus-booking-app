import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const API_URL = "http://localhost:5000/api/users";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/login`, { phone, password });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", response.data.user.role);

      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else if (response.data.user.role === "moderator") {
        navigate("/moderator");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 Вход</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="tel"
          placeholder="📞 Телефон"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          pattern="[+]*[0-9]{10,15}"
          title="Введите номер в формате +375XXXXXXXXX"
        />
        <input
          type="password"
          placeholder="🔑 Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "⏳ Вход..." : "Войти"}
        </button>
      </form>

      <p>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </div>
  );
};

export default Login;