<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['name'], $data['email'], $data['password'])) {
    echo json_encode(['error' => 'Datos incompletos']);
    exit;
}

$name = $data['name'];
$email = $data['email'];
$password = password_hash($data['password'], PASSWORD_BCRYPT);

$sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $name, $email, $password);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Usuario registrado']);
} else {
    echo json_encode(['error' => 'Email ya existe']);
}

$stmt->close();
$conn->close();
?>