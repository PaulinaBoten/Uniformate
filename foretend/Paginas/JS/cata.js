import { addToPedidos } from "./pedidosManager.js";

document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    alert("Debes iniciar sesión para solicitar uniformes.");
    window.location.href = "inicio.html";
    return;
  }

  // Selecciona todos los botones de "Solicitar Uniforme"
  const botones = document.querySelectorAll(".add-to-basket-btn");

  botones.forEach(btn => {
    btn.addEventListener("click", async () => {
      const uniformeId = btn.dataset.id;  // viene del catálogo (ej: "sudadera-deportiva")
      const cantidad = 1; // fijo a 1 para pedidos individuales

      // Llamar a la API de pedidos
      const result = await addToPedidos(uniformeId, cantidad, token);

      if (result) {
        alert(`✅ Pedido de "${btn.dataset.name}" creado con éxito.`);
        // Redirigir a pedidos.html
        window.location.href = "pedidos.html";
      } else {
        alert("❌ Error al crear el pedido.");
      }
    });
  });
});
