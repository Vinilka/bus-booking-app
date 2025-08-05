import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Функция для получения токена из localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getDrivers = () => axios.get(`${API_URL}/drivers`);
export const createDriver = (data) => axios.post(`${API_URL}/drivers`, data);

// Функция получения данных о пользователе
export const getUserData = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/me`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке пользователя", error);
    return null;
  }
};
