// URL base de la API (ajústala a tu backend)
const API_URL = "https://uniformate.onrender.com/api/pedidos";

// 🟢 Obtener pedidos del backend (para estudiantes muestra los suyos, para admin muestra todos)
export async function getPedidos() {
  try {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Error al obtener pedidos");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// 🟢 Crear un pedido (estudiante)
export async function addToPedidos(uniformeId, cantidad, userId) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inventario_id: uniformeId, cantidad, usuario_id: userId }),
    });
    if (!res.ok) throw new Error("Error al crear pedido");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// 🟡 Aceptar pedido (solo admin)
export async function aceptarPedido(pedidoId, token) {
  try {
    const res = await fetch(`${API_URL}/${pedidoId}/aceptar`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Error al aceptar pedido");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// 🔴 Rechazar pedido (solo admin)
export async function rechazarPedido(pedidoId, token) {
  try {
    const res = await fetch(`${API_URL}/${pedidoId}/rechazar`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Error al rechazar pedido");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}