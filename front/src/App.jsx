import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CellsPage from "./pages/CellsPage";
import CellDetailPage from "./pages/CellDetailPage";
import UsersPage from "./pages/UsersPage";
import DinosaursPage from "./pages/DinosaursPage";
import ProfilePage from "./pages/ProfilePage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/cells"
          element={
            <PrivateRoute>
              <CellsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/cells/:id"
          element={
            <PrivateRoute>
              <CellDetailPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/users"
          element={
            <PrivateRoute>
              <UsersPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/dinosaurs"
          element={
            <PrivateRoute>
              <DinosaursPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;