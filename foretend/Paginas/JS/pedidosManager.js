// URL base de la API (ajústala a tu backend)
const API_URL = "http://localhost:3000/api/pedidos";

// 🟢 Obtener pedidos del backend (para estudiantes muestra los suyos, para admin muestra todos)
export async function getPedidos(token) {
  try {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
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
export async function addToPedidos(uniformeId, cantidad, token) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uniforme_id: uniformeId, cantidad }),
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