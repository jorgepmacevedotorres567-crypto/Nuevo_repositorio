<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

require 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

$data = json_decode(file_get_contents("php://input"), true);
// Log temporal para depuración
file_put_contents('debug.log', date('Y-m-d H:i:s') . "\n" . print_r($data, true) . "\n", FILE_APPEND);

file_put_contents('debug.log', print_r($data, true), FILE_APPEND); // Log de depuración


if ($method === 'POST') {
    // Crear playlist
    $user_id = isset($data['user_id']) ? $data['user_id'] : null;
    $name = isset($data['name']) ? $data['name'] : null;
    $image = isset($data['image']) ? $data['image'] : null; // Recibe la URL de la imagen

    if (!$user_id || !$name) {
        echo json_encode(['error' => 'Faltan datos requeridos']);
        exit;
    }

    $sql = "INSERT INTO playlists (user_id, name, image) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iss", $user_id, $name, $image);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'id' => $stmt->insert_id, 'image' => $image]);
    } else {
        echo json_encode(['error' => 'Error al crear playlist']);
    }
    $stmt->close();

} elseif ($method === 'GET') {
    // Obtener playlists del usuario
    $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;

    if (!$user_id) {
        echo json_encode(['error' => 'Falta user_id']);
        exit;
    }

    $sql = "SELECT id, name, image, created_at FROM playlists WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $playlists = [];
    while ($row = $result->fetch_assoc()) {
        // Asegura que el campo image siempre esté presente y sea string (puede ser null)
        $row['image'] = isset($row['image']) ? $row['image'] : null;
        $playlists[] = $row;
    }

    echo json_encode($playlists);
    $stmt->close();

} elseif ($method === 'DELETE') {
    // Eliminar playlist
    $playlist_id = isset($data['playlist_id']) ? $data['playlist_id'] : null;

    if (!$playlist_id) {
        echo json_encode(['error' => 'Falta playlist_id']);
        exit;
    }

    $sql = "DELETE FROM playlists WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $playlist_id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Error al eliminar']);
    }
    $stmt->close();
}

$conn->close();