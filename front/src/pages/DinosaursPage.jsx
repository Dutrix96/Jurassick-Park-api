import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function DinosaursPage() {
  const navigate = useNavigate();

  const [dinosaurs, setDinosaurs] = useState([]);
  const [cells, setCells] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    nick: "",
    species: "",
    age: 1,
    diet: "CARNIVORE",
    danger_level: "HIGH",
    cell_id: "",
  });

  useEffect(() => {
    fetchDinosaurs();
    fetchCells();
  }, []);

  const fetchDinosaurs = async () => {
    try {
      const res = await api.get("/admin/dinosaurs");
      setDinosaurs(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCells = async () => {
    try {
      const res = await api.get("/admin/cells");
      setCells(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setForm({
      nick: "",
      species: "",
      age: 1,
      diet: "CARNIVORE",
      danger_level: "HIGH",
      cell_id: "",
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      age: Number(form.age),
      cell_id: form.cell_id === "" ? null : Number(form.cell_id),
    };

    try {
      if (editingId) {
        await api.put(`/admin/dinosaurs/${editingId}`, payload);
      } else {
        await api.post("/admin/dinosaurs", payload);
      }

      resetForm();
      fetchDinosaurs();
    } catch (error) {
      console.error(error);
      alert("Error al guardar dinosaurio");
    }
  };

  const handleEdit = (dino) => {
    setEditingId(dino.id);
    setForm({
      nick: dino.nick,
      species: dino.species,
      age: dino.age,
      diet: dino.diet,
      danger_level: dino.danger_level,
      cell_id: dino.cell_id || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Seguro que quieres eliminar este dinosaurio?")) return;

    try {
      await api.delete(`/admin/dinosaurs/${id}`);
      fetchDinosaurs();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar dinosaurio");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={() => navigate("/dashboard")}>Volver</button>
      <h1>Gestion de dinosaurios</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          name="nick"
          placeholder="Nick"
          value={form.nick}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="species"
          placeholder="Especie"
          value={form.species}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Edad"
          value={form.age}
          onChange={handleChange}
          min="1"
          required
        />

        <select name="diet" value={form.diet} onChange={handleChange}>
          <option value="HERBIVORE">HERBIVORE</option>
          <option value="CARNIVORE">CARNIVORE</option>
          <option value="OMNIVORE">OMNIVORE</option>
        </select>

        <select
          name="danger_level"
          value={form.danger_level}
          onChange={handleChange}
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>

        <select name="cell_id" value={form.cell_id} onChange={handleChange}>
          <option value="">Sin celda</option>
          {cells.map((cell) => (
            <option key={cell.id} value={cell.id}>
              Celda {cell.row}-{cell.col}
            </option>
          ))}
        </select>

        <button type="submit">
          {editingId ? "Actualizar dinosaurio" : "Crear dinosaurio"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancelar
          </button>
        )}
      </form>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nick</th>
            <th>Especie</th>
            <th>Edad</th>
            <th>Dieta</th>
            <th>Peligro</th>
            <th>Celda</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {dinosaurs.map((dino) => (
            <tr key={dino.id}>
              <td>{dino.id}</td>
              <td>{dino.nick}</td>
              <td>{dino.species}</td>
              <td>{dino.age}</td>
              <td>{dino.diet}</td>
              <td>{dino.danger_level}</td>
              <td>
                {dino.cell ? `Celda ${dino.cell.row}-${dino.cell.col}` : "Sin celda"}
              </td>
              <td>
                <button onClick={() => handleEdit(dino)}>Editar</button>
                <button onClick={() => handleDelete(dino.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DinosaursPage;