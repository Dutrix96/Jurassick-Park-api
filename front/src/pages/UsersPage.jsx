import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function UsersPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "VET",
    avatar_url: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      role: "VET",
      avatar_url: "",
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

    try {
      if (editingId) {
        const payload = {
          name: form.name,
          email: form.email,
          role: form.role,
          avatar_url: form.avatar_url || null,
        };

        if (form.password.trim() !== "") {
          payload.password = form.password;
        }

        await api.put(`/admin/users/${editingId}`, payload);
      } else {
        await api.post("/admin/users", {
          ...form,
          avatar_url: form.avatar_url || null,
        });
      }

      resetForm();
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Error al guardar usuario");
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      avatar_url: user.avatar_url || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Seguro que quieres eliminar este usuario?")) return;

    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar usuario");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={() => navigate("/dashboard")}>Volver</button>
      <h1>Gestion de trabajadores</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder={editingId ? "Nueva password (opcional)" : "Password"}
          value={form.password}
          onChange={handleChange}
          required={!editingId}
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="ADMIN">ADMIN</option>
          <option value="VET">VET</option>
          <option value="MAINT">MAINTENANCE</option>
        </select>
        <input
          type="text"
          name="avatar_url"
          placeholder="Avatar URL opcional"
          value={form.avatar_url}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId ? "Actualizar usuario" : "Crear usuario"}
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
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Avatar</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {user.avatar_url ? (
                  <img
                    src={`http://localhost:8080${user.avatar_url}`}
                    alt={user.name}
                    width="50"
                  />
                ) : (
                  "Sin avatar"
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(user)}>Editar</button>
                <button onClick={() => handleDelete(user.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersPage;