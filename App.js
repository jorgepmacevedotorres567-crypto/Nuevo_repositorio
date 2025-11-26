import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PlaylistDetail from "./pages/PlaylistDetail";
import Profile from "./pages/Profile";
import "./App.css";

function TopMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("click", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  })();

  const goProfile = () => {
    setOpen(false);
    navigate("/profile");
  };

  const logout = async () => {
    try { await fetch("http://localhost/spotify-api/logout.php", { method: "POST", credentials: "include" }); } catch {}
    localStorage.removeItem("user");
    setOpen(false);
    navigate("/login");
  };

  const initials = user && user.name ? user.name.split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase() : "CU";

  return (
    <div ref={ref} style={{ position: "fixed", right: 16, top: 12, zIndex: 1000 }}>
      {/* botón tipo avatar / menú */}
      <button
        className="topmenu-btn topmenu-avatar"
        title={user && user.name ? user.name : "Cuenta"}
        onClick={() => setOpen(v => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {/* si tienes imagen de usuario úsala */}
        {user && user.image ? (
          <img src={user.image} alt="avatar" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontWeight: 700 }}>{initials}</span>
        )}
      </button>

      {open && (
        <div className="topmenu-dropdown" role="menu" style={{ right: 0, position: "absolute", marginTop: 8 }}>
          <button onClick={goProfile} className="topmenu-item">Perfil</button>
          <button onClick={logout} className="topmenu-item">Cerrar sesión</button>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <TopMenu />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/playlist/:id" element={<PlaylistDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;