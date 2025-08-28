 <?php
 $servername = "sql100.byethost6.com"; // Reemplaza con tu hostname
 $username = "b6_39700561"; // Reemplaza con tu usuario
 $password = "ValePau20"; // Reemplaza con tu contraseña
 $dbname = "b6_39700561_Uniformate"; // Reemplaza con tu base de datos
 // Crear conexión
 $conn = new mysqli($servername, $username, $password, $dbname);
 // Verificar conexión
 if ($conn->connect_error) {
 die("Conexión fallida: " . $conn->connect_error);
 }
 ?>