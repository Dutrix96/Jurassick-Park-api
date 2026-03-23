import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import UsersPage from "./pages/UsersPage";
import DinosaursPage from "./pages/DinosaursPage";
import CellsPage from "./pages/CellsPage";
import CellDetailPage from "./pages/CellDetailPage";
import WorkerTasksPage from "./pages/WorkerTasksPage";
import AdminTasksPage from "./pages/AdminTasksPage";
import SimulationsPage from "./pages/SimulationsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/tasks/my-tasks" element={<WorkerTasksPage />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/dinosaurs" element={<DinosaursPage />} />
          <Route path="/admin/cells" element={<CellsPage />} />
          <Route path="/admin/cells/:id" element={<CellDetailPage />} />
          <Route path="/admin/tasks" element={<AdminTasksPage />} />
          <Route path="/admin/simulations" element={<SimulationsPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;