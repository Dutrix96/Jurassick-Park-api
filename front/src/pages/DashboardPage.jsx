import { Link } from "react-router-dom";
import { getStoredUser } from "../api/api";

function DashboardPage() {
  const user = getStoredUser();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <p>Bienvenido {user?.name}</p>
      <p>Rol: {user?.role}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "320px" }}>
        <Link to="/profile">Mi perfil</Link>

        {(user?.role === "VET" || user?.role === "MAINT") && (
          <Link to="/tasks/my-tasks">Mis tareas</Link>
        )}

        {user?.role === "ADMIN" && (
          <>
            <Link to="/admin/cells">Gestionar celdas</Link>
            <Link to="/admin/users">Gestionar usuarios</Link>
            <Link to="/admin/dinosaurs">Gestionar dinosaurios</Link>
            <Link to="/admin/tasks">Gestionar tareas</Link>
            <Link to="/admin/simulations">Simulaciones</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;