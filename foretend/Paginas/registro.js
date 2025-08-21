
    document.getElementById('loginForm').addEventListener('submit', function(event) {
      event.preventDefault(); // Evita el envío del formulario

      // Limpiar errores anteriores
      document.getElementById('emailError').textContent = '';
      document.getElementById('passwordError').textContent = '';

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      let isValid = true;

      // Validación de correo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        document.getElementById('emailError').textContent = 'Ingrese un correo válido.';
        isValid = false;
      }

      // Validación de contraseña (mínimo 6 caracteres)
      if (password.length < 6) {
        document.getElementById('passwordError').textContent = 'La contraseña debe tener al menos 6 caracteres.';
        isValid = false;
      }

      if (isValid) {
        alert('Formulario enviado correctamente.');
        // Aquí puedes enviar el formulario o hacer una petición fetch/ajax
      }
    });
      const form = document.getElementById('form');
        const passwordInput = document.getElementById('password');
        const mensaje = document.getElementById('mensaje');

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = passwordInput.value;
            const minLength = 8;


            if (password.length < minLength) {
                e.preventDefault(); // Detiene el envío del formulario
                mensaje.textContent = "La contraseña debe tener al menos ${minLength} caracteres para continuar".
                passwordInput.focus();
            } else {
                mensaje.textContent = "";
                alert("Contraseña válida, avanzando a la siguiente página.");
               
        }});