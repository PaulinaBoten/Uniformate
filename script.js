// Escucha el evento "submit" del formulario con id "loginForm".
// Cuando el formulario se envíe, ejecuta la función async que recibe el evento `e`.
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  // Evita que el formulario haga el comportamiento por defecto (recargar la página).
  e.preventDefault();

  // Obtiene el valor actual del campo con id "username" y lo guarda en la constante `username`.
  const username = document.getElementById("username").value;
  // Obtiene el valor actual del campo con id "password" y lo guarda en la constante `password`.
  const password = document.getElementById("password").value;

  try {
    // Realiza una petición HTTP usando fetch al endpoint especificado.
    // `await` hace que el código espere la respuesta de la petición antes de continuar.
    const res = await fetch("http://localhost/git/Uniformate/backend/login", {
      method: "POST", // Método HTTP usado: POST (para enviar datos al servidor).
      headers: { "Content-Type": "application/json" }, // Indica que el cuerpo será JSON.
      // Convierte el objeto { username, password } a una cadena JSON para enviarla en el cuerpo.
      body: JSON.stringify({ username, password })
    });

    // Parsea la respuesta HTTP como JSON y la guarda en `data`.
    // Se espera que `data` sea un objeto (por ejemplo: { success: true, message: "..." }).
    const data = await res.json();

    // Muestra el mensaje de respuesta del servidor en el elemento con id "mensaje".
    // Por ejemplo `data.message` podría ser "Login exitoso" o "Credenciales inválidas".
    document.getElementById("mensaje").innerText = data.message;

    // Si la respuesta indica éxito (propiedad `success` verdadera), pinta el texto de verde.
    if (data.success) {
      document.getElementById("mensaje").style.color = "green";
    } else {
      // Si no fue exitoso, pinta el texto de rojo para indicar error/advertencia.
      document.getElementById("mensaje").style.color = "red";
    }
  } catch (error) {
    // Si ocurre cualquier error en la petición (p. ej. servidor caído o CORS), entra aquí.
    // Muestra un mensaje de error genérico al usuario.
    document.getElementById("mensaje").innerText = "Error de conexión con el servidor.";
    // Pinta el mensaje de color rojo.
    document.getElementById("mensaje").style.color = "red";
  }
});