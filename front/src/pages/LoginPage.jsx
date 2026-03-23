import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { setStoredAuth } from "../api/api";

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const loginRes = await api.post("/auth/login", form);

      const token = loginRes.data.token;
      const user = loginRes.data.user;

      setStoredAuth({ token, user });

      if (user.role === "ADMIN") {
        navigate("/dashboard");
        return;
      }

      if (user.role === "VET" || user.role === "MAINTENANCE") {
        navigate("/tasks/my-tasks");
        return;
      }

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401 && error.config?.url?.includes("/auth/login")) {
        alert("Credenciales incorrectas");
      } else if (error.response?.status === 401 && error.config?.url?.includes("/auth/me")) {
        alert("Login correcto, pero no se pudo recuperar el usuario autenticado");
      } else {
        alert("No se pudo conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "320px" }}>
        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Contrasena"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Iniciar sesion"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;