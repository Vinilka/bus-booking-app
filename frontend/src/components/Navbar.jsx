import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setRole(localStorage.getItem("userRole"));
  }, [localStorage.getItem("token")]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>🚌 Bus Booking</h2>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Поиск</Link>
        </li>
        <li>
          <Link to="/routes">Маршруты</Link>
        </li>

        {/* New tab for Passengers by Date (moderator/admin only) */}
        {(role === "moderator" || role === "admin") && (
          <li>
            <Link to="/passengers-by-date">Пассажиры по дате</Link>
          </li>
        )}

        {/* Для модераторов и админов – управление автобусами */}
        {(role === "moderator" || role === "admin") && (
          <>
            <li>
              <Link to="/buses">Автобусы</Link>
            </li>
            <li>
              <Link to="/drivers">Водители</Link>
            </li>
          </>
        )}

        {/* Для модератора */}
        {role === "moderator" && (
          <li>
            <Link to="/moderator">Модератор</Link>
          </li>
        )}

        {/* Для администратора */}
        {role === "admin" && (
          <li>
            <Link to="/admin">Админ</Link>
          </li>
        )}

        {token && (
          <li>
            <Link to="/profile">Профиль</Link>
          </li>
        )}

        {!token ? (
          <>
            <li>
              <Link to="/login">Вход</Link>
            </li>
            <li>
              <Link to="/register">Регистрация</Link>
            </li>
          </>
        ) : (
          <li>
            <button onClick={handleLogout}>🚪 Выйти</button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
