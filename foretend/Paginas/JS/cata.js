document.addEventListener("DOMContentLoaded", () => {
  const userId = sessionStorage.getItem("userId");

  if (!userId) {
    alert("Debes iniciar sesión para solicitar uniformes.");
    window.location.href = "inicio.html";
    return;
  }

  const botones = document.querySelectorAll(".add-to-basket-btn");

  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      const uniformeId = parseInt(btn.dataset.id);
      const nombre = btn.dataset.name;
      const cantidad = 1;

      const carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

      const existente = carrito.find(item => item.inventario_id === uniformeId);
      if (existente) {
        existente.cantidad += 1;
      } else {
        carrito.push({ inventario_id: uniformeId, nombre, cantidad });
      }

      sessionStorage.setItem("carrito", JSON.stringify(carrito));
      alert(`✅ "${nombre}" agregado al carrito.`);
    });
  });
});
