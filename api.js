const API_URL = "http://localhost/spotify-api";

// Registro
export const registerUser = async (name, email, password) => {
  const response = await fetch(`${API_URL}/register.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return response.json();
};

// Login
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/login.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

// Obtener playlists
export const getPlaylists = async (user_id) => {
  const response = await fetch(`${API_URL}/playlists.php?user_id=${user_id}`);
  return response.json();
};

// Crear playlist
export const createPlaylist = async (user_id, name) => {
  const response = await fetch(`${API_URL}/playlists.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, name }),
  });
  return response.json();
};

// Eliminar playlist
export const deletePlaylist = async (playlist_id) => {
  const response = await fetch(`${API_URL}/playlists.php`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playlist_id }),
  });
  return response.json();
};

// Obtener canciones
export const getSongs = async (playlist_id) => {
  const response = await fetch(`${API_URL}/songs.php?playlist_id=${playlist_id}`);
  return response.json();
};

// Agregar canción
export const addSong = async (playlist_id, name, artist, duration, image) => {
  const response = await fetch(`${API_URL}/songs.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playlist_id, name, artist, duration, image }),
  });
  return response.json();
};

// Editar canción
export const editSong = async (song_id, name, artist, duration, image) => {
  const response = await fetch(`${API_URL}/songs.php`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ song_id, name, artist, duration, image }),
  });
  return response.json();
};

// Eliminar canción
export const deleteSong = async (song_id) => {
  const response = await fetch(`${API_URL}/songs.php`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ song_id }),
  });
  return response.json();
};