<?php
require 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

if ($method === 'POST') {
    // Agregar canción
    $playlist_id = $data['playlist_id'];
    $name = $data['name'];
    $artist = $data['artist'];
    $duration = $data['duration'];
    $image = $data['image'];

    $sql = "INSERT INTO songs (playlist_id, name, artist, duration, image) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("issss", $playlist_id, $name, $artist, $duration, $image);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'id' => $stmt->insert_id]);
    } else {
        echo json_encode(['error' => 'Error al agregar canción']);
    }
    $stmt->close();
} elseif ($method === 'GET') {
    // Obtener canciones de una playlist
    $playlist_id = $_GET['playlist_id'];

    $sql = "SELECT id, name, artist, duration, image FROM songs WHERE playlist_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $playlist_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $songs = [];
    while ($row = $result->fetch_assoc()) {
        $songs[] = $row;
    }

    echo json_encode($songs);
    $stmt->close();
} elseif ($method === 'DELETE') {
    // Eliminar canción
    $song_id = $data['song_id'];

    $sql = "DELETE FROM songs WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $song_id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Error al eliminar']);
    }
    $stmt->close();
}

$conn->close();
?>