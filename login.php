<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['email'], $data['password'])) {
    echo json_encode(['error' => 'Datos incompletos']);
    exit;
}

$email = $data['email'];
$password = $data['password'];

$sql = "SELECT id, name, email, password FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    if (password_verify($password, $user['password'])) {
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email']
            ]
        ]);
    } else {
        echo json_encode(['error' => 'Contraseña incorrecta']);
    }
} else {
    echo json_encode(['error' => 'Usuario no encontrado']);
}

$stmt->close();
$conn->close();
?>