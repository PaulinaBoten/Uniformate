// frontend/Paginas/JS/auth.js
document.addEventListener('DOMContentLoaded', function() {
    const token = sessionStorage.getItem('token');
    const userRole = sessionStorage.getItem('userRole');
    const userId = sessionStorage.getItem('userId');
    const userFullName = sessionStorage.getItem('userFullName'); // Asumimos que también guardamos el nombre completo

    const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
    const enlaceUsuarios = document.getElementById('enlaceUsuarios');
    const enlaceAdmin = document.getElementById('enlaceAdmin');
    const uniformsInBasketCountElement = document.getElementById('uniformsInBasketCount'); // Para el contador de uniformes en la cesta

    // Función para actualizar el contador de uniformes en la cesta
    const updateUniformsInBasketCount = () => {
        const uniformBasket = JSON.parse(sessionStorage.getItem('uniformBasket')) || [];
        const totalUniforms = uniformBasket.length; // Contamos items únicos, no cantidades si siempre es 1
        if (uniformsInBasketCountElement) {
            uniformsInBasketCountElement.textContent = totalUniforms;
        }
    };

    // Si no hay token, redirige a la página de inicio de sesión
    if (!token && !window.location.pathname.includes('inicio.html')) {
        alert('Debes iniciar sesión para acceder a esta página.');
        window.location.href = 'inicio.html';
    } else {
        console.log('Usuario autenticado. Rol:', userRole, 'ID:', userId, 'Nombre:', userFullName);
        if (cerrarSesionBtn) cerrarSesionBtn.style.display = 'block';

        if (userRole === 'administrador') {
            if (enlaceAdmin) enlaceAdmin.style.display = 'block';
            if (enlaceUsuarios) enlaceUsuarios.style.display = 'none';
        } else { // Rol 'estudiante'
            if (enlaceAdmin) enlaceAdmin.style.display = 'none';
            // if (enlaceUsuarios) enlaceUsuarios.style.display = 'block'; // Mostrar enlace de usuarios para estudiantes si aplica
        }
    }

    // Lógica para cerrar sesión
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', function(e) {
            e.preventDefault();

            sessionStorage.removeItem('token');
            sessionStorage.removeItem('userRole');
            sessionStorage.removeItem('userId');
            sessionStorage.removeItem('userEmail');
            sessionStorage.removeItem('userFullName');
            sessionStorage.removeItem('uniformBasket'); // Limpiar la cesta al cerrar sesión

            alert('Has cerrado sesión exitosamente.');
            window.location.href = 'inicio.html';
        });
    }

    // Actualizar contador de cesta al cargar la página y escuchar eventos
    updateUniformsInBasketCount();
    document.addEventListener('uniformBasketUpdated', updateUniformsInBasketCount);
});