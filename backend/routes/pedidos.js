// backend/routes/pedidos.js
import express from "express";
import pool from "../db/pool.js";

const router = express.Router();

/**
 * 🛒 Crear un nuevo pedido (solo estudiantes)
 */
router.post("/", async (req, res) => {
  try {
    const { usuario_id, inventario_id, cantidad } = req.body;

    // Validaciones básicas
    if (!usuario_id || !inventario_id || !cantidad || cantidad <= 0) {
      return res.status(400).json({ error: "Datos de pedido inválidos" });
    }

    // Verificar que el producto exista
    const [producto] = await pool.query("SELECT * FROM inventario WHERE id = ?", [inventario_id]);
    if (producto.length === 0) {
      return res.status(404).json({ error: "El producto no existe" });
    }

    // Verificar stock suficiente
    if (producto[0].cantidad < cantidad) {
      return res.status(400).json({ error: "Stock insuficiente para este pedido" });
    }

    // Insertar pedido
    const [result] = await pool.query(
      "INSERT INTO pedidos (usuario_id, inventario_id, cantidad) VALUES (?, ?, ?)",
      [usuario_id, inventario_id, cantidad]
    );

    res.status(201).json({ message: "✅ Pedido creado correctamente", pedidoId: result.insertId });
  } catch (error) {
    console.error("❌ Error al crear pedido:", error.message);
    res.status(500).json({ error: "Error al crear el pedido" });
  }
});

/**
 * 📋 Obtener todos los pedidos (solo admin)
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.id, 
        u.correo AS usuario, 
        i.nombre AS producto, 
        p.cantidad, 
        p.estado, 
        p.fecha
      FROM pedidos p
      JOIN usuarios u ON p.usuario_id = u.id
      JOIN inventario i ON p.inventario_id = i.id
      ORDER BY p.fecha DESC
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Error al obtener pedidos:", error.message);
    res.status(500).json({ error: "Error al obtener los pedidos" });
  }
});

/**
 * ✅ Aceptar pedido y actualizar inventario
 */
router.put("/:id/aceptar", async (req, res) => {
  const { id } = req.params;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Obtener el pedido y producto relacionados
    const [[pedido]] = await connection.query("SELECT * FROM pedidos WHERE id = ?", [id]);
    if (!pedido) {
      await connection.rollback();
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    const [[producto]] = await connection.query("SELECT * FROM inventario WHERE id = ?", [pedido.inventario_id]);
    if (!producto) {
      await connection.rollback();
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    if (producto.cantidad < pedido.cantidad) {
      await connection.rollback();
      return res.status(400).json({ error: "Stock insuficiente para aceptar el pedido" });
    }

    // Actualizar estado del pedido
    await connection.query("UPDATE pedidos SET estado = 'aceptado' WHERE id = ?", [id]);

    // Reducir stock
    await connection.query(
      "UPDATE inventario SET cantidad = cantidad - ? WHERE id = ?",
      [pedido.cantidad, pedido.inventario_id]
    );

    await connection.commit();
    res.json({ message: "✅ Pedido aceptado y stock actualizado" });
  } catch (error) {
    await connection.rollback();
    console.error("❌ Error al aceptar pedido:", error.message);
    res.status(500).json({ error: "Error al aceptar el pedido" });
  } finally {
    connection.release();
  }
});

/**
 * ❌ Rechazar pedido
 */
router.put("/:id/rechazar", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("UPDATE pedidos SET estado = 'rechazado' WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    res.json({ message: "❌ Pedido rechazado correctamente" });
  } catch (error) {
    console.error("❌ Error al rechazar pedido:", error.message);
    res.status(500).json({ error: "Error al rechazar el pedido" });
  }
});

export default router;
