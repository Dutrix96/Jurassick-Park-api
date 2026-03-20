import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

function CellDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cell, setCell] = useState(null);
  const [form, setForm] = useState({
    security_level: "",
    food_level: "",
    pending_repairs: "",
    notes: "",
  });

  useEffect(() => {
    fetchCell();
  }, [id]);

  const fetchCell = async () => {
    try {
      const res = await api.get(`/admin/cells/${id}`);
      const data = res.data.data;
      setCell(data);
      setForm({
        security_level: data.security_level,
        food_level: data.food_level,
        pending_repairs: data.pending_repairs,
        notes: data.notes || "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/admin/cells/${id}`, {
        security_level: Number(form.security_level),
        food_level: Number(form.food_level),
        pending_repairs: Number(form.pending_repairs),
        notes: form.notes,
      });

      fetchCell();
      alert("Celda actualizada");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar celda");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Seguro que quieres eliminar esta celda?")) return;

    try {
      await api.delete(`/admin/cells/${id}`);
      navigate("/cells");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar celda");
    }
  };

  if (!cell) return <p>Cargando...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={() => navigate("/cells")}>Volver</button>
      <h1>
        Celda {cell.row}-{cell.col}
      </h1>

      <div style={{ marginBottom: "2rem" }}>
        <p><strong>Seguridad:</strong> {cell.security_level}</p>
        <p><strong>Comida:</strong> {cell.food_level}</p>
        <p><strong>Averias:</strong> {cell.pending_repairs}</p>
        <p><strong>Notas:</strong> {cell.notes || "Sin notas"}</p>
      </div>

      <form onSubmit={handleUpdate} style={{ marginBottom: "2rem" }}>
        <h2>Editar celda</h2>
        <input
          type="number"
          name="security_level"
          value={form.security_level}
          onChange={handleChange}
          min="0"
          max="100"
        />
        <input
          type="number"
          name="food_level"
          value={form.food_level}
          onChange={handleChange}
          min="0"
          max="100"
        />
        <input
          type="number"
          name="pending_repairs"
          value={form.pending_repairs}
          onChange={handleChange}
          min="0"
        />
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Notas"
        />
        <button type="submit">Guardar cambios</button>
      </form>

      <div style={{ marginBottom: "2rem" }}>
        <h2>Dinosaurios</h2>
        {cell.dinosaurs && cell.dinosaurs.length > 0 ? (
          <ul>
            {cell.dinosaurs.map((dino) => (
              <li key={dino.id}>
                {dino.nick} - {dino.species}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay dinosaurios en esta celda</p>
        )}
      </div>

      <button onClick={handleDelete}>Eliminar celda</button>
    </div>
  );
}

export default CellDetailPage;