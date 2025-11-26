<?php
require 'config.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error'=>'Método no soportado']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$user_id = isset($data['user_id']) ? intval($data['user_id']) : ($_SESSION['user_id'] ?? null);
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = isset($data['password']) && $data['password'] !== '' ? $data['password'] : null;

if (!$user_id || !$name || !$email) {
    http_response_code(400);
    echo json_encode(['error'=>'user_id, name y email son requeridos']);
    exit;
}

$fields = [];
$types = '';
$values = [];

$fields[] = "name = ?";
$types .= 's'; $values[] = $name;

$fields[] = "email = ?";
$types .= 's'; $values[] = $email;

if ($password !== null && $password !== '') {
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $fields[] = "password = ?";
    $types .= 's'; $values[] = $hash;
}

$sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?";
$types .= 'i'; $values[] = $user_id;

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['error'=>'DB prepare error','message'=>$conn->error]);
    exit;
}
$stmt->bind_param($types, ...$values);
if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['error'=>'DB execute error','message'=>$stmt->error]);
    $stmt->close();
    exit;
}
$stmt->close();

$r = $conn->prepare("SELECT id, name, email FROM users WHERE id = ?");
$r->bind_param("i", $user_id);
$r->execute();
$res = $r->get_result();
$user = $res->fetch_assoc();
$r->close();

echo json_encode(['success'=>true, 'user'=>$user]);
$conn->close();
?>