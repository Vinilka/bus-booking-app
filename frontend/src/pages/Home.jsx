import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import React from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import CustomPopper from "../components/CustomPopper";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Popper from "@mui/material/Popper";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import PeopleIcon from "@mui/icons-material/People";
import {
  Box,
  Paper,
  Button,
  Stack,
  Container,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";

const API_URL = "http://localhost:5000/api";

const NAROCH_CHILD_STOPS = [
  "деревня Нарочь",
  "Вокзал Нарочь",
  "Санаторий Нарочь",
  "Санаторий Белая Русь",
  "Санаторий Нарочанский Берег",
  "санаторий Приозерный",
  "санаторий Спутник",
  "Зубренок",
  "санаторий Сосны",
  "санаторий Нарочанка",
];

export default function Home() {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [date, setDate] = useState("");
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [stops, setStops] = useState([]);
  const [toOptions, setToOptions] = useState([]);
  const [passengers, setPassengers] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const passengerOptions = [1, 2, 3, 4, 5, 6];

  const inputBoxStyle = {
    display: "flex",
    alignItems: "center",
    bgcolor: "#f5faff",
    borderRadius: 3,
    p: 1.5,
    minHeight: { xs: 60, sm: 60, md: 56 },
    width: "100%",
  };

  const iconStyle = {
    mr: { xs: 1.5, sm: 1 },
    color: "#1976d2",
  };

  const buttonSearch = {
    fontWeight: "bold",
    fontSize: { xs: 18, sm: 20, md: 22 },
    borderRadius: 3,
    py: { xs: 1.5, sm: 2 },
    mt: { xs: 2, md: 0 },
  };

  useEffect(() => {
    axios.get(`${API_URL}/routes/all-stops`).then((res) => {
      console.log("🛑 Список остановок:", res.data); // ← добавь
      setStops(res.data);
    });
  }, []);

  useEffect(() => {
    if (!fromCity) {
      setToOptions([]);
      return;
    }

    axios
      .get(`${API_URL}/routes/available-to-stops`, {
        params: { from: fromCity },
      })
      .then((res) => setToOptions(res.data))
      .catch((err) => {
        console.error("Ошибка при загрузке 'Куда':", err);
        setToOptions([]);
      });
  }, [fromCity]);
  // Функция для получения доступных остановок "Куда" на основе выбранной остановки "Откуда"

  // Build grouped options for 'Откуда'
  const fromOptions = [...stops]
    .map((stop) => ({
      label: stop,
      value: stop,
      group: NAROCH_CHILD_STOPS.includes(stop) ? "Нарочь" : "Города",
    }))
    .sort((a, b) => a.group.localeCompare(b.group));
  // Build grouped options for 'Куда'
  const toGroupedOptions = [...toOptions]
    .map((stop) => ({
      label: stop,
      value: stop,
      group: NAROCH_CHILD_STOPS.includes(stop) ? "Нарочь" : "",
    }))
    .sort((a, b) => a.group.localeCompare(b.group));

  // Функция загрузки маршрутов (оптимизирована с useCallback)
  const loadRoutes = useCallback(async () => {
    if (!fromCity || !toCity || !date) {
      setError("Введите все данные для поиска");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Запрос к API для получения маршрутов
      const response = await axios.get(`${API_URL}/routes/search`, {
        params: { from: fromCity, to: toCity },
      });

      if (Array.isArray(response.data) && response.data.length > 0) {
        setRoutes(response.data);
      } else {
        setRoutes([]);
        setError("❌ Маршруты не найдены");
      }
    } catch (error) {
      setError("Ошибка при загрузке маршрутов. Попробуйте снова.");
      console.error("Ошибка API:", error);
    } finally {
      setLoading(false);
    }
  }, [fromCity, toCity, date]);

  // Helper for Russian pluralization of 'Пассажир'
  function pluralizePassenger(n) {
    if (n % 10 === 1 && n % 100 !== 11) return "Пассажир";
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100))
      return "Пассажира";
    return "Пассажиров";
  }

  return (
    <>
      <Box bgcolor="#f7fafd" py={6}>
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          color="primary"
          sx={{ mt: { xs: 2, sm: 4 }, textAlign: "center" }}
        >
          Поиск билетов
        </Typography>
        <Container maxWidth="lg" sx={{ mt: 2 }}>
          <Paper
            elevation={3}
            sx={{
              maxWidth: "100%",
              borderRadius: 4,
              gap: 2,
              bgcolor: "#fff",
              boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
              border: "2px solid #1976d2",
              p: { xs: 2, sm: 3 },
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateAreas: {
                    xs: `
      "from"
      "swap"
      "to"
      "date"
      "passengers"
      "search"
    `,
                    sm: `
      "from from swap"
    "to to   swap"
    "date  passengers passengers"
    "search search search"
    `,
                    md: `
      "from swap to date passengers search"
    `,
                  },
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr 60px",
                    md: "2.5fr 0.5fr 2.5fr 2.5fr 2fr 2fr",
                  },
                }}
              >
                {/* From field */}
                <Box sx={{ gridArea: "from" }}>
                  <Box
                    sx={{
                      bgcolor: "#f5faff",
                      borderRadius: isOpen ? "12px 12px 0 0" : "12px",

                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      transition: "border-radius 200ms ease",

                      minHeight: "100%",
                      pt: 1,
                    }}
                  >
                    <Autocomplete
                      fullWidth
                      options={fromOptions}
                      onOpen={() => setIsOpen(true)}
                      onClose={() => setIsOpen(false)}
                      groupBy={(option) => option.group}
                      getOptionLabel={(option) => option.label}
                      value={
                        fromOptions.find((opt) => opt.value === fromCity) ||
                        null
                      }
                      clearOnEscape
                      disablePortal
                      slots={{ popper: CustomPopper }}
                      slotProps={{
                        popper: {
                          sx: { zIndex: 1500, width: "100%" },
                        },
                        paper: {
                          sx: {
                            backgroundColor: "#f5faff",
                            mt: 0,
                            overflow: "hidden",
                            width: "100% !important",
                            borderRadius: "0 0 12px 12px",
                            boxShadow: "none",
                            transition: "border-radius 200ms ease",

                            fontFamily:
                              '"Roboto","Helvetica","Arial",sans-serif',
                            fontSize: "1rem",
                            lineHeight: 1.5,
                            letterSpacing: "0.00938em",
                            py: 1,
                          },
                        },

                        option: {
                          sx: {
                            backgroundColor: "#f5faff",
                            px: 2,
                            py: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            transition: "background-color 0.2s",
                            "&[aria-selected='true']": {
                              backgroundColor: "#d7ebff",
                            },
                            "&:hover": {
                              backgroundColor: "#d7ebff",
                            },
                          },
                        },
                      }}
                      onChange={(_, newValue) =>
                        setFromCity(newValue ? newValue.value : "")
                      }
                      renderGroup={(params) => (
                        <React.Fragment key={params.key}>
                          <Box
                            sx={{
                              color: "#1362b0",
                              fontWeight: 800,
                              fontSize: 14,

                              px: 2,
                              py: 1.5,
                            }}
                          >
                            {params.group}
                          </Box>
                          {params.children}
                        </React.Fragment>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Откуда"
                          variant="outlined"
                          size="small"
                          multiline
                          rows={2}
                          sx={{
                            flex: 1,
                            minHeight: 56,
                            "& label": {
                              pl: 0.5,
                              pt: 0.5,
                              shrink: true,
                            },
                          }}
                          InputProps={{
                            ...params.InputProps,

                            startAdornment: (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <LocationOnIcon
                                  sx={{ color: "#1976d2", ml: 1 }}
                                />
                                {params.InputProps.startAdornment}
                              </Box>
                            ),
                            sx: {
                              flex: 1,
                              "& .MuiAutocomplete-endAdornment": {
                                right: "0  !important",
                                "& svg": {
                                  width: "1.2em",
                                  pr: 1,
                                  fontSize: 22,
                                  transition: "none ",

                                  margin: "0 ",
                                  height: "24px ",

                                  minWidth: "24px ",
                                  boxSizing: "content-box ",
                                  display: "flex ",
                                  alignItems: "center ",
                                  justifyContent: "center ",
                                  border: "none ",
                                  background: "none ",
                                },
                              },
                              "& .MuiAutocomplete-startAdornment": {
                                "& svg": {
                                  width: "1.2em",
                                  pr: 1,
                                  fontSize: 22,
                                  transition: "none ",

                                  margin: "0 ",
                                  height: "24px ",

                                  minWidth: "24px ",
                                  boxSizing: "content-box ",
                                  display: "flex ",
                                  alignItems: "center ",
                                  justifyContent: "center ",
                                  border: "none ",
                                  background: "none ",
                                },
                              },
                              "& .MuiAutocomplete-popupIndicator": {
                                pl: 1,
                                margin: "0 !important",
                                height: "24px !important",
                                width: "24px !important",
                                minWidth: "24px !important",
                                boxSizing: "content-box !important",
                                display: "flex !important",
                                alignItems: "center !important",
                                justifyContent: "center !important",
                                border: "none !important",
                                background: "none !important",
                                transition: "none !important",
                              },
                              "& .MuiAutocomplete-clearIndicator": {
                                fontSize: "20px !important",
                                padding: 0,
                                marginRight: "4px",
                                alignSelf: "center",
                              },

                              backgroundColor: "transparent",
                              border: "none",
                              boxShadow: "none",
                              "& fieldset": {
                                border: "none",
                              },

                              "& textarea": {
                                resize: "none",
                                overflow: "hidden",
                                padding: 0,
                                lineHeight: 1.4,
                                fontSize: "1rem",
                                pt: 0.5,
                              },

                              alignItems: "center",
                              "&:focus-within": {
                                boxShadow: "none",
                                borderColor: "transparent",
                              },
                              "& input:focus": {
                                outline: "none",
                                boxShadow: "none",
                              },
                              "& input": {
                                whiteSpace: "normal",
                                overflow: "visible",
                                textOverflow: "unset",
                                display: "block",
                                lineHeight: 1.2,
                                fontSize: 1,
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </Box>
                </Box>
                {/* Swap icon */}
                <Box
                  sx={{
                    gridArea: "swap",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gridRow: {
                      sm: "span 2",
                    },
                  }}
                >
                  <SwapHorizIcon sx={{ color: "#1976d2" }} />
                </Box>
                {/* To field */}
                <Box
                  sx={{
                    gridArea: "to",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box sx={inputBoxStyle}>
                    <Autocomplete
                      options={toGroupedOptions}
                      groupBy={(option) => option.group}
                      getOptionLabel={(option) => option.label}
                      value={
                        toGroupedOptions.find((opt) => opt.value === toCity) ||
                        null
                      }
                      onChange={(_, newValue) =>
                        setToCity(newValue ? newValue.value : "")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Куда"
                          variant="standard"
                          InputProps={{
                            ...params.InputProps,
                            disableUnderline: true,
                          }}
                        />
                      )}
                      sx={{ flex: 1, minWidth: 0 }}
                    />
                  </Box>
                </Box>
                {/* Dates row - stacks on mobile, row on desktop */}
                <Box
                  sx={{
                    gridArea: "date",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {/* Departure date */}
                  <Box sx={inputBoxStyle}>
                    <CalendarTodayIcon sx={{ mr: 1, color: "#1976d2" }} />
                    <DatePicker
                      label="Дата отправления"
                      value={date}
                      onChange={setDate}
                      slotProps={{
                        textField: {
                          variant: "standard",
                          InputProps: { disableUnderline: true },
                        },
                      }}
                      sx={{ flex: 1, minWidth: 0 }}
                    />
                  </Box>
                </Box>
                {/* Passengers row */}
                <Box
                  sx={{
                    gridArea: "passengers",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box sx={inputBoxStyle}>
                    <PeopleIcon sx={{ mr: 1 }} />
                    <TextField
                      select
                      label="Количество пассажиров"
                      value={passengers}
                      onChange={(e) => setPassengers(Number(e.target.value))}
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                      sx={{ minWidth: 120 }}
                    >
                      {passengerOptions.map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt} {pluralizePassenger(opt)}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Box>
                {/* Search button - always full width and prominent */}
                <Box
                  sx={{
                    gridArea: "search",
                    display: "flex",
                    alignItems: "stretch",
                    py: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    sx={{ fontWeight: "bold", fontSize: 18 }}
                    onClick={loadRoutes}
                  >
                    ИСКАТЬ
                  </Button>
                </Box>
              </Box>
            </LocalizationProvider>
          </Paper>
        </Container>
      </Box>
      <Box mt={4}>
        {loading && <Typography>⏳ Загрузка маршрутов...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {routes.length > 0 && (
          <Box mt={2}>
            {routes.map((route) => (
              <Paper key={route._id} sx={{ p: 2, mb: 2 }}>
                <Typography>
                  {route.name} | 🕒 {route.departure_time} –{" "}
                  {route.arrival_time} | 💰 {route.base_price} BYN
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/booking/${route._id}`)}
                >
                  Забронировать
                </Button>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
}
