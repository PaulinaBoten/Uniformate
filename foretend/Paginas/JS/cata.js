import { addToPedidos } from "./pedidosManager.js";

document.addEventListener("DOMContentLoaded", () => {
  const userId = sessionStorage.getItem("userId");

  if (!userId) {
    alert("Debes iniciar sesión para solicitar uniformes.");
    window.location.href = "inicio.html";
    return;
  }

  const botones = document.querySelectorAll(".add-to-basket-btn");

  botones.forEach(btn => {
    btn.addEventListener("click", async () => {
      const uniformeId = btn.dataset.id;
      const cantidad = 1;
      const nombre = btn.dataset.name;

      try {
        const result = await addToPedidos(uniformeId, cantidad, userId);

        if (result) {
          alert(`✅ Pedido de "${nombre}" creado con éxito.`);
          window.location.href = "pedidos.html";
        } else {
          alert("❌ Error al crear el pedido. Intenta nuevamente.");
        }
      } catch (error) {
        console.error("Error al crear pedido:", error);
        alert("⚠️ Ocurrió un error inesperado.");
      }
    });
  });
});
