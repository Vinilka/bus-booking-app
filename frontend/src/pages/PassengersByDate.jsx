import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ruLocale from "date-fns/locale/ru";

// PassengersByDate page allows moderator/admin to select a date and view all passengers (bookings) for that date
function PassengersByDate() {
  // state for selected date and bookings data
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // format date as YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  // fetch bookings when selectedDate changes
  useEffect(() => {
    if (!selectedDate) return;
    setLoading(true); // strating loading process until data is fetched
    axios
      .get(`/api/bookings/by-date?date=${formatDate(selectedDate)}`)
      .then((res) => setBookings(Array.isArray(res.data) ? res.data : []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", padding: 24 }}>
      <Typography variant="h4" gutterBottom>
        Пассажиры на дату:
      </Typography>
      {/* date picker for selecting the date */}
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={ruLocale}
      >
        <DatePicker
          label="Выберите дату"
          value={selectedDate}
          onChange={setSelectedDate}
          slotProps={{ textField: { sx: { mb: 3 } } }}
        />
      </LocalizationProvider>
      {/* table displaying bookings for the selected date */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Имя</TableCell>
              <TableCell>Телефон</TableCell>
              <TableCell>Остановкa отправления</TableCell>
              <TableCell>Остановкa прибытия</TableCell>
              <TableCell>Статус оплаты</TableCell>
              <TableCell>Дата поездки</TableCell>
              <TableCell>Дата бронирования</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7}>Загрузка...</TableCell>
              </TableRow>
            ) : Array.isArray(bookings) && bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>Нет данных</TableCell>
              </TableRow>
            ) : (
              bookings.map((b) => (
                <TableRow key={b._id}>
                  <TableCell>{b.name}</TableCell>
                  <TableCell>{b.phone}</TableCell>
                  <TableCell>{b.departure_stop}</TableCell>
                  <TableCell>{b.arrival_stop}</TableCell>
                  <TableCell>{b.status}</TableCell>
                  <TableCell>{b.date}</TableCell>
                  <TableCell>
                    {new Date(b.createdAt).toLocaleString("ru-RU")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default PassengersByDate;
