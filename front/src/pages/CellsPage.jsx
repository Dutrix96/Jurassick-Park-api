import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function CellsPage() {
  const navigate = useNavigate();
  const [cells, setCells] = useState([]);

  useEffect(() => {
    fetchCells();
  }, []);

  const fetchCells = async () => {
    try {
      const res = await api.get("/admin/cells");
      setCells(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <button onClick={() => navigate("/dashboard")}>Volver</button>
      <h1>Celdas del parque</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {cells.map((cell) => (
          <div
            key={cell.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "1rem",
              width: "300px",
            }}
          >
            <h2>
              Celda {cell.row}-{cell.col}
            </h2>
            <p>Seguridad: {cell.security_level}</p>
            <p>Comida: {cell.food_level}</p>
            <p>Averias: {cell.pending_repairs}</p>
            <button onClick={() => navigate(`/cells/${cell.id}`)}>
              Ver detalle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CellsPage;