// ...existing code...
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PlaylistForm() {
  const [name, setName] = useState("");
  const [useFile, setUseFile] = useState(true);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getUserId = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      return u && u.id ? u.id : 1;
    } catch {
      return 1;
    }
  };

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (imageUrl) {
      setPreview(imageUrl);
    } else {
      setPreview(null);
    }
  }, [file, imageUrl]);

  const onFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Nombre requerido");
    setLoading(true);

    try {
      const user_id = getUserId();

      if (useFile && file) {
        const fd = new FormData();
        fd.append("user_id", user_id);
        fd.append("name", name);
        fd.append("image", file);
        if (imageUrl) fd.append("image_url", imageUrl);

        const res = await fetch("http://localhost/spotify-api/playlists.php", {
          method: "POST",
          body: fd
        });
        const json = await res.json();
        if (json.success) {
          navigate(`/playlist/${json.id}`);
        } else {
          alert(json.error || "Error al crear playlist");
        }
      } else {
        const body = { user_id, name, image_url: imageUrl || null };
        const res = await fetch("http://localhost/spotify-api/playlists.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const json = await res.json();
        if (json.success) {
          navigate(`/playlist/${json.id}`);
        } else {
          alert(json.error || "Error al crear playlist");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error de red al crear playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="playlist-form">
      <h2>Crear Playlist</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            placeholder="Nombre de la playlist"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="input-option">
          <label>
            <input
              type="radio"
              checked={useFile}
              onChange={() => setUseFile(true)}
            /> Subir imagen
          </label>
          <label>
            <input
              type="radio"
              checked={!useFile}
              onChange={() => setUseFile(false)}
            /> Usar URL
          </label>
        </div>

        {useFile ? (
          <div className="form-row">
            <input type="file" accept="image/*" onChange={onFileChange} />
            <div className="image-preview">
              {preview ? <img src={preview} alt="preview" /> : <div className="help">Sin imagen</div>}
            </div>
          </div>
        ) : (
          <div className="form-row">
            <input
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <div className="image-preview">
              {preview ? <img src={preview} alt="preview" /> : <div className="help">Sin imagen</div>}
            </div>
          </div>
        )}

        <div className="controls">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Guardando..." : "Crear playlist"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
// ...existing code...