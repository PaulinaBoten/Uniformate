// backend/routes/pedidos.js
import express from "express";
import pool from "../db/pool.js";

const router = express.Router();

/* ============================================================
   🟢 Crear un nuevo pedido
============================================================ */
router.post("/", async (req, res) => {
  try {
    let { usuario_id, inventario_id, cantidad } = req.body;

    usuario_id = Number(usuario_id);
    inventario_id = Number(inventario_id);
    cantidad = Number(cantidad);

    console.log("📦 Body recibido:", { usuario_id, inventario_id, cantidad });

    if (!usuario_id || !inventario_id || !cantidad || cantidad <= 0) {
      return res.status(400).json({ error: "Datos de pedido inválidos" });
    }

    // Verificar existencia del producto
    const producto = await pool.query("SELECT * FROM inventario WHERE id = $1", [inventario_id]);
    if (producto.rows.length === 0) {
      return res.status(404).json({ error: "El producto no existe" });
    }

    // Verificar stock suficiente
    if (producto.rows[0].cantidad < cantidad) {
      return res.status(400).json({ error: "Stock insuficiente para este pedido" });
    }

    // Insertar pedido
    const result = await pool.query(
      "INSERT INTO pedidos (usuario_id, inventario_id, cantidad) VALUES ($1, $2, $3) RETURNING id",
      [usuario_id, inventario_id, cantidad]
    );

    res.status(201).json({
      message: "✅ Pedido creado correctamente",
      pedidoId: result.rows[0].id,
    });
  } catch (error) {
    console.error("❌ Error al crear pedido:", error.message);
    res.status(500).json({ error: "Error al crear el pedido" });
  }
});

/* ============================================================
   📋 Obtener pedidos (por usuario o todos)
============================================================ */
router.get("/", async (req, res) => {
  const { usuario_id } = req.query; // si se pasa, se filtra; si no, se devuelven todos
  console.log("🧾 Consultando pedidos. usuario_id =", usuario_id || "TODOS");

  try {
    let query;
    let params = [];

    if (usuario_id) {
      // Solo pedidos de un usuario específico
      query = `
        SELECT 
          p.id,
          p.cantidad,
          p.estado,
          p.fecha,
          i.nombre AS producto,
          u.correo AS usuario
        FROM pedidos p
        JOIN inventario i ON p.inventario_id = i.id
        JOIN usuarios u ON p.usuario_id = u.id
        WHERE p.usuario_id = $1
        ORDER BY p.fecha DESC
      `;
      params = [usuario_id];
    } else {
      // Todos los pedidos (modo admin)
      query = `
        SELECT 
          p.id,
          p.cantidad,
          p.estado,
          p.fecha,
          i.nombre AS producto,
          u.correo AS usuario
        FROM pedidos p
        JOIN inventario i ON p.inventario_id = i.id
        JOIN usuarios u ON p.usuario_id = u.id
        ORDER BY p.fecha DESC
      `;
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error exacto al obtener pedidos:", error);
    res.status(500).json({ error: "Error al obtener pedidos" });
  }
});

/* ============================================================
   ✅ Aceptar pedido y actualizar inventario
============================================================ */
router.put("/:id/aceptar", async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const pedido = await client.query("SELECT * FROM pedidos WHERE id = $1", [id]);
    if (pedido.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    const inventario_id = pedido.rows[0].inventario_id;
    const cantidadPedido = pedido.rows[0].cantidad;

    const producto = await client.query("SELECT * FROM inventario WHERE id = $1", [inventario_id]);
    if (producto.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    if (producto.rows[0].cantidad < cantidadPedido) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Stock insuficiente para aceptar el pedido" });
    }

    // Actualizar estado del pedido
    await client.query("UPDATE pedidos SET estado = 'aceptado' WHERE id = $1", [id]);

    // Reducir stock del inventario
    await client.query(
      "UPDATE inventario SET cantidad = cantidad - $1 WHERE id = $2",
      [cantidadPedido, inventario_id]
    );

    await client.query("COMMIT");
    res.json({ message: "✅ Pedido aceptado y stock actualizado" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error al aceptar pedido:", error.message);
    res.status(500).json({ error: "Error al aceptar el pedido" });
  } finally {
    client.release();
  }
});

/* ============================================================
   ❌ Rechazar pedido
============================================================ */
router.put("/:id/rechazar", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE pedidos SET estado = 'rechazado' WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    res.json({ message: "❌ Pedido rechazado correctamente" });
  } catch (error) {
    console.error("❌ Error al rechazar pedido:", error.message);
    res.status(500).json({ error: "Error al rechazar el pedido" });
  }
});

/* ============================================================
   🗑️ Eliminar pedido (solo admin)
============================================================ */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM pedidos WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    res.json({ message: "🗑️ Pedido eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar pedido:", error.message);
    res.status(500).json({ error: "Error al eliminar el pedido" });
  }
});

export default router;
