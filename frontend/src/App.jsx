import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import ModeratorPanel from "./pages/ModeratorPanel";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AllRoutes from "./pages/AllRoutes";
import AdminRoutes from "./pages/AdminRoutes";
import ManageBuses from "./pages/ManageBuses";
import Footer from "./components/Footer";
import ManageDrivers from "./pages/ManageDrivers";
import PassengersByDate from "./pages/PassengersByDate";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

// 🔒 Приватный маршрут
const PrivateRoute = ({ element, roles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(userRole)) return <Navigate to="/" replace />;

  return element;
};

function App() {
  return (
    <Router>
      <CssBaseline />
      <Navbar />
      {/* Main content area: use MUI Box for layout and background */}
      <Box
        bgcolor="#f7fafd"
        minHeight="100vh"
        display="flex"
        flexDirection="column"
      >
        {/* All routes/pages are rendered here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/routes" element={<AllRoutes />} />
          <Route
            path="/admin-routes"
            element={
              <PrivateRoute
                element={<AdminRoutes />}
                roles={["moderator", "admin"]}
              />
            }
          />
          <Route
            path="/buses"
            element={
              <PrivateRoute
                element={<ManageBuses />}
                roles={["moderator", "admin"]}
              />
            }
          />
          <Route path="/booking/:routeId" element={<Booking />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute
                element={<Profile />}
                roles={["user", "moderator", "admin"]}
              />
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute element={<AdminPanel />} roles={["admin"]} />
            }
          />
          <Route
            path="/drivers"
            element={
              <PrivateRoute
                element={<ManageDrivers />}
                roles={["admin", "moderator"]}
              />
            }
          />
          <Route
            path="/moderator"
            element={
              <PrivateRoute
                element={<ModeratorPanel />}
                roles={["moderator", "admin"]}
              />
            }
          />
          <Route path="/passengers-by-date" element={<PassengersByDate />} />
        </Routes>
      </Box>
      <Footer />
    </Router>
  );
}

export default App;
