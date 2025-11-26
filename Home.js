import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPlaylists, createPlaylist, deletePlaylist } from "../api";
import "../styles/Home.css";

function Home() {
  const [playlists, setPlaylists] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistImageUrl, setPlaylistImageUrl] = useState(""); // Nuevo estado para la URL de la imagen
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      navigate("/login");
      return;
    }
    const userData = JSON.parse(savedUser);
    setUser(userData);
    fetchPlaylists(userData.id);
  }, [navigate]);

  const fetchPlaylists = async (userId) => {
    try {
      setLoading(true);
      const result = await getPlaylists(userId);
      setPlaylists(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Error al cargar playlists:", err);
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim()) {
      alert("Ingresa un nombre para la playlist");
      return;
    }

    try {
      const result = await createPlaylist(user.id, playlistName, playlistImageUrl); // Pasar la URL de la imagen
      if (result.success) {
        setPlaylistName("");
        setPlaylistImageUrl(""); // Reiniciar el estado de la URL de la imagen
        setShowModal(false);
        fetchPlaylists(user.id);
      } else {
        alert(result.error || "Error al crear playlist");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error de conexión");
    }
  };

  const handleDeletePlaylist = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta playlist?")) {
      try {
        const result = await deletePlaylist(id);
        if (result.success) {
          fetchPlaylists(user.id);
        } else {
          alert(result.error || "Error al eliminar");
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Error de conexión");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Mis Playlists</h1>
        <div className="header-right">
          <span className="user-name">Hola, {user?.name}!</span>
        </div>
      </header>

      <button onClick={() => setShowModal(true)} className="btn-create-playlist">
        + Nueva Playlist
      </button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Crear Nueva Playlist</h2>
            <input
              type="text"
              placeholder="Nombre de la playlist"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCreatePlaylist()}
            />
            {/* Etiqueta y campo para la URL de la imagen */}
            <label style={{ fontSize: "13px", color: "#888", marginTop: 8, marginBottom: 4, display: "block" }}>
              Ingresa la URL de la imagen de la playlist (opcional)
            </label>
            <input
              type="url"
              placeholder="URL de la imagen (https://...)"
              value={playlistImageUrl}
              onChange={(e) => setPlaylistImageUrl(e.target.value)}
            />
            {/* Vista previa de la imagen si la URL es válida */}
            {playlistImageUrl && (
              <div style={{ margin: "10px 0" }}>
                <img
                  src={playlistImageUrl}
                  alt="preview"
                  style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #ccc" }}
                  onError={e => { e.target.style.display = "none"; }}
                />
              </div>
            )}
            <div className="modal-buttons">
              <button onClick={handleCreatePlaylist} className="btn-primary">
                Crear
              </button>
              <button onClick={() => setShowModal(false)} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="playlists-grid">
        {playlists.length > 0 ? (
          playlists.map((playlist) => (
            <div key={playlist.id} className="playlist-card">
              <div
                className="playlist-image"
                onClick={() => navigate(`/playlist/${playlist.id}`)}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                  background: "#444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 8px auto",
                  overflow: "hidden",
                  border: "1px solid #ccc"
                }}
              >
                {playlist.image ? (
                  <img
                    src={playlist.image}
                    alt={playlist.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                    onError={e => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div style={{ color: "#bbb", fontSize: 22, textAlign: "center" }}>
                    🎵
                  </div>
                )}
              </div>
              <h3>{playlist.name}</h3>
              <button
                onClick={() => handleDeletePlaylist(playlist.id)}
                className="btn-delete"
              >
                Eliminar
              </button>
            </div>
          ))
        ) : (
          <p className="no-playlists">No tienes playlists. ¡Crea una!</p>
        )}
      </div>
    </div>
  );
}

export default Home;