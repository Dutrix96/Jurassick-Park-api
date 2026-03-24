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
      alert("Error al cargar la celda");
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

      await fetchCell();
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
      navigate("/admin/cells");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar celda");
    }
  };

  if (!cell) return <p>Cargando...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={() => navigate("/admin/cells")}>Volver</button>

      <h1>
        Celda {cell.row}-{cell.col}
      </h1>

      <div style={{ marginBottom: "2rem" }}>
        <p>
          <strong>Seguridad:</strong> {cell.security_level}
        </p>
        <p>
          <strong>Comida:</strong> {cell.food_level}
        </p>
        <p>
          <strong>Averias:</strong> {cell.pending_repairs}
        </p>
        <p>
          <strong>Notas:</strong> {cell.notes || "Sin notas"}
        </p>
      </div>

      <form onSubmit={handleUpdate} style={{ marginBottom: "2rem" }}>
        <h2>Editar celda</h2>

        <div style={{ marginBottom: "1rem" }}>
          <label>Seguridad</label>
          <br />
          <input
            type="number"
            name="security_level"
            value={form.security_level}
            onChange={handleChange}
            min="0"
            max="100"
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Comida</label>
          <br />
          <input
            type="number"
            name="food_level"
            value={form.food_level}
            onChange={handleChange}
            min="0"
            max="100"
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Averias</label>
          <br />
          <input
            type="number"
            name="pending_repairs"
            value={form.pending_repairs}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Notas</label>
          <br />
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Notas"
            rows="4"
            cols="40"
          />
        </div>

        <button type="submit">Guardar cambios</button>
      </form>

      <div style={{ marginBottom: "2rem" }}>
        <h2>Dinosaurios</h2>

        {cell.dinosaurs && cell.dinosaurs.length > 0 ? (
          <ul>
            {cell.dinosaurs.map((dino) => (
              <li key={dino.id}>
                <strong>{dino.nick}</strong> - {dino.species} - {dino.diet} - peligro:{" "}
                {dino.danger_level}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay dinosaurios en esta celda</p>
        )}
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2>Tareas en esta celda</h2>

        {cell.tasks && cell.tasks.length > 0 ? (
          <ul>
            {cell.tasks.map((task) => (
              <li key={task.id} style={{ marginBottom: "1rem" }}>
                <strong>{task.title}</strong> - {task.type} - {task.status}
                <br />
                Prioridad: {task.priority}
                <br />
                Trabajador: {task.user ? task.user.name : "Sin asignar"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay tareas en esta celda</p>
        )}
      </div>

      <button onClick={handleDelete}>Eliminar celda</button>
    </div>
  );
}

export default CellDetailPage;