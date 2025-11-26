import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSongs, addSong, deleteSong } from "../api";
import "../styles/PlaylistDetail.css";

function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlistName, setPlaylistName] = useState("");
  const [songs, setSongs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [songData, setSongData] = useState({
    name: "",
    artist: "",
    duration: "",
    image: "",
  });

  // obtener usuario actual desde localStorage (puedes cambiar por contexto/estado global)
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();
  const initials =
    user && user.name
      ? user.name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()
      : "CU";

  useEffect(() => {
    fetchPlaylistData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPlaylistData = async () => {
    try {
      setLoading(true);
      const localUser = JSON.parse(localStorage.getItem("user"));
      if (!localUser) {
        navigate("/login");
        return;
      }

      setPlaylistName(`Playlist ${id}`);

      const result = await getSongs(id);
      setSongs(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSong = async () => {
    if (
      !songData.name ||
      !songData.artist ||
      !songData.duration ||
      !songData.image
    ) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      const result = await addSong(
        id,
        songData.name,
        songData.artist,
        songData.duration,
        songData.image
      );

      if (result.success) {
        setSongData({ name: "", artist: "", duration: "", image: "" });
        setShowModal(false);
        fetchPlaylistData();
      } else {
        alert(result.error || "Error al agregar canción");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error de conexión");
    }
  };

  const handleRemoveSong = async (songId) => {
    if (window.confirm("¿Eliminar esta canción?")) {
      try {
        const result = await deleteSong(songId);
        if (result.success) {
          fetchPlaylistData();
        } else {
          alert(result.error || "Error al eliminar");
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Error de conexión");
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="playlist-detail-container">
      {/* Header: avatar + editar perfil + volver */}
      <div className="playlist-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user && user.image ? (
            <img src={user.image} alt="avatar" style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }} />
          ) : (
            <div style={{ width: 44, height: 44, borderRadius: 8, background: "#222", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
              {initials}
            </div>
          )}
          <div>
            <div style={{ fontSize: 14, color: "#888" }}>Usuario</div>
            <div style={{ fontWeight: 700 }}>{user ? user.name : "Invitado"}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => navigate("/home")} className="btn-back">
            ← Volver
          </button>
        </div>
      </div>

      <h1 style={{ marginTop: 18 }}>{playlistName}</h1>

      <button onClick={() => setShowModal(true)} className="btn-add-song">
        + Agregar Canción
      </button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Agregar Canción</h2>
            <input
              type="text"
              placeholder="Nombre de la canción"
              value={songData.name}
              onChange={(e) =>
                setSongData({ ...songData, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Artista"
              value={songData.artist}
              onChange={(e) =>
                setSongData({ ...songData, artist: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Duración (mm:ss)"
              value={songData.duration}
              onChange={(e) =>
                setSongData({ ...songData, duration: e.target.value })
              }
            />
            {/* Opción para ingresar la URL de la imagen */}
            <input
              type="url"
              placeholder="URL de la imagen (https://...)"
              value={songData.image}
              onChange={(e) =>
                setSongData({ ...songData, image: e.target.value })
              }
            />
            <label style={{ fontSize: "13px", color: "#888", marginBottom: 6, display: "block" }}>
              Ingresa la URL de la imagen para la canción
            </label>
            {songData.image && (
              <div style={{ margin: "10px 0" }}>
                <img
                  src={songData.image}
                  alt="preview"
                  style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #ccc" }}
                  onError={e => { e.target.style.display = "none"; }}
                />
              </div>
            )}
            <div className="modal-buttons">
              <button onClick={handleAddSong} className="btn-primary">
                Agregar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="songs-list">
        {songs.length > 0 ? (
          songs.map((song) => (
            <div key={song.id} className="song-item">
              <img src={song.image} alt={song.name} className="song-image" />
              <div className="song-info">
                <h3>{song.name}</h3>
                <p>{song.artist}</p>
                <span>{song.duration}</span>
              </div>
              <button
                onClick={() => handleRemoveSong(song.id)}
                className="btn-remove-song"
              >
                Eliminar
              </button>
            </div>
          ))
        ) : (
          <p className="no-songs">
            No hay canciones en esta playlist. ¡Agrega una!
          </p>
        )}
      </div>
    </div>
  );
}

export default PlaylistDetail;