import { useEffect, useState } from "react";
import { getDrivers, createDriver } from "../utils/api";

function ManageDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", license_number: "" });

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    const res = await getDrivers();
    setDrivers(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createDriver(form);
    setForm({ name: "", phone: "", license_number: "" });
    loadDrivers();
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>🚘 Управление водителями</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Имя"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Телефон"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
        <input
          placeholder="Лицензия"
          value={form.license_number}
          onChange={(e) => setForm({ ...form, license_number: e.target.value })}
          required
        />
        <button type="submit">➕ Добавить</button>
      </form>

      <ul>
        {drivers.map((d) => (
          <li key={d._id}>
            {d.name} — {d.phone} (лицензия: {d.license_number})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageDrivers;
