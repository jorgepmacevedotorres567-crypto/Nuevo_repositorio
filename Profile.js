import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const u = (() => { try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; } })();
    if (u) {
      setName(u.name || "");
      setEmail(u.email || "");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || !user.id) return alert("Usuario no identificado");

    try {
      const body = { user_id: user.id, name, email, password: password || null };
      const res = await fetch("http://localhost/spotify-api/profile.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      if (json.success && json.user) {
        localStorage.setItem("user", JSON.stringify(json.user));
        navigate("/home");
      } else alert(json.error || "Error al guardar");
    } catch (err) {
      alert("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "32px auto", padding: 20, background: "#181818", borderRadius: 12, color: "#fff" }}>
      <h2>Editar perfil</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input value={name} onChange={e => setName(e.target.value)} required style={{ width: "100%", marginBottom: 10 }} />
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: "100%", marginBottom: 10 }} />
        <label>Contraseña</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", marginBottom: 10 }} />
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 10, background: "#1db954", color: "#fff", border: "none", borderRadius: 8 }}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
        <button type="button" onClick={() => navigate(-1)} style={{ width: "100%", marginTop: 8, padding: 10, background: "#444", color: "#fff", border: "none", borderRadius: 8 }}>
          Cancelar
        </button>
        <button type="button" onClick={() => navigate("/home")} style={{ width: "100%", marginTop: 8, padding: 10, background: "#222", color: "#fff", border: "none", borderRadius: 8 }}>
          Volver a Home
        </button>
      </form>
    </div>
  );
}