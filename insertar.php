<?php
include 'conexion.php'; // Archivo con tus credenciales y conexión

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $conn->real_escape_string($_POST['email']);
    $password = $conn->real_escape_string($_POST['password']);

    // Guardar la contraseña de forma segura (encriptada)
    $hash = password_hash($password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO usuarios (email, password) VALUES ('$email', '$hash')";

    if ($conn->query($sql) === TRUE) {
        echo "Usuario registrado correctamente";
        echo "<br><a href='inicio.html'>Volver al inicio</a>";
    } else {
        echo "Error: " . $conn->error;
    }
}

$conn->close();
?>