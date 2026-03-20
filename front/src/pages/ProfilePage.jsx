import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function ProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      const user = res.data.data;
      setProfile(user);
      setProfileForm({
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      await api.put("/profile", profileForm);
      fetchProfile();
      alert("Perfil actualizado");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar perfil");
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();

    try {
      await api.put("/profile/password", passwordForm);
      setPasswordForm({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
      alert("Contrasena actualizada");
    } catch (error) {
      console.error(error);
      alert("Error al cambiar contrasena");
    }
  };

  const updateAvatar = async (e) => {
    e.preventDefault();

    if (!avatar) {
      alert("Selecciona una imagen");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      await api.post("/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAvatar(null);
      fetchProfile();
      alert("Avatar actualizado");
    } catch (error) {
      console.error(error);
      alert("Error al subir avatar");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={() => navigate("/dashboard")}>Volver</button>
      <h1>Mi perfil</h1>

      {profile && (
        <div style={{ marginBottom: "2rem" }}>
          <p><strong>Nombre:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Rol:</strong> {profile.role}</p>

          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="avatar" width="120" />
          ) : (
            <p>Sin avatar</p>
          )}
        </div>
      )}

      <form onSubmit={updateProfile} style={{ marginBottom: "2rem" }}>
        <h2>Editar perfil</h2>
        <input
          type="text"
          name="name"
          value={profileForm.name}
          onChange={handleProfileChange}
          placeholder="Nombre"
        />
        <input
          type="email"
          name="email"
          value={profileForm.email}
          onChange={handleProfileChange}
          placeholder="Email"
        />
        <button type="submit">Guardar perfil</button>
      </form>

      <form onSubmit={updatePassword} style={{ marginBottom: "2rem" }}>
        <h2>Cambiar contrasena</h2>
        <input
          type="password"
          name="current_password"
          value={passwordForm.current_password}
          onChange={handlePasswordChange}
          placeholder="Contrasena actual"
        />
        <input
          type="password"
          name="password"
          value={passwordForm.password}
          onChange={handlePasswordChange}
          placeholder="Nueva contrasena"
        />
        <input
          type="password"
          name="password_confirmation"
          value={passwordForm.password_confirmation}
          onChange={handlePasswordChange}
          placeholder="Confirmar nueva contrasena"
        />
        <button type="submit">Cambiar contrasena</button>
      </form>

      <form onSubmit={updateAvatar}>
        <h2>Actualizar avatar</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files[0])}
        />
        <button type="submit">Subir avatar</button>
      </form>
    </div>
  );
}

export default ProfilePage;