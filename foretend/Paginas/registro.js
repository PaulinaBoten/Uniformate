
ocument.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario

    // Limpiar errores anteriores
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('mensaje').textContent = '';

    const email = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    let isValid = true;

    // Validación de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('emailError').textContent = 'Ingrese un correo válido.';
        isValid = false;
    }

    // Validación de contraseña (mínimo 8 caracteres)
    const minLength = 8;
    if (password.length < minLength) {
        document.getElementById('passwordError').textContent = `La contraseña debe tener al menos ${minLength} caracteres.`;
        isValid = false;
    }

    if (isValid) {
        alert('Formulario enviado correctamente.');
        // Aquí puedes enviar el formulario con fetch/ajax
    }
});