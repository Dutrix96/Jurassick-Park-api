import { Navigate, Route, Routes } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CellsPage from './pages/CellsPage'
import CellDetailPage from './pages/CellDetailPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

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
    </Routes>
  )
}