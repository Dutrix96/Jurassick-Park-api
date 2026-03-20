import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useEffect, useState } from "react";

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchMe();
  }, []);

  const fetchMe = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.data || res.data.user || res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1>Panel de administracion</h1>
          <p>
            Bienvenido, {user?.name} ({user?.role})
          </p>
        </div>

        <button onClick={handleLogout}>Cerrar sesion</button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <button onClick={() => navigate("/cells")}>Gestionar celdas</button>
        <button onClick={() => navigate("/users")}>Gestionar trabajadores</button>
        <button onClick={() => navigate("/dinosaurs")}>Gestionar dinosaurios</button>
        <button onClick={() => navigate("/profile")}>Mi perfil</button>
      </div>
    </div>
  );
}

export default DashboardPage;