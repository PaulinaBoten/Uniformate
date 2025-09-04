<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Para pruebas con frontend en otra carpeta
header("Access-Control-Allow-Methods: POST,GET,OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include "db.php";

if ($_SERVER['REQUEST_METHOD']=== 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Leer datos del POST
$data = json_decode(file_get_contents("php://input"));
$username = $data->username;
$password = md5($data->password); // Encriptado simple con MD5 (puedes mejorar con password_hash)

$sql = "SELECT * FROM usuarios WHERE username=? AND password=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["success" => true, "message" => "Login correcto"]);
} else {
    echo json_encode(["success" => false, "message" => "Usuario o contraseña incorrectos"]);
}

    $stmt->close();
    $conn->close();

?>