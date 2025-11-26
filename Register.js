import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api";
import "../styles/Auth.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const result = await registerUser(name, email, password);

      if (result.success) {
        alert("Registro exitoso. Ahora inicia sesión");
        navigate("/login");
      } else {
        setError(result.error || "Error al registrar");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Spotify Clone</h1>
        <h2>Registrarse</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
        <p>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;