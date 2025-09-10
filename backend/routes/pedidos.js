import express from "express";
import pool from "../db.js";

const router = express.Router();

// Crear pedido (usuario/estudiante)
router.post("/", async (req, res) => {
  const { id_usuario, id_producto } = req.body;

  if (!id_usuario || !id_producto) {
    return res.status(400).json({ error: "Faltan datos para crear el pedido" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO pedidos (id_usuario, id_producto) VALUES (?, ?)",
      [id_usuario, id_producto]
    );
    res.json({ message: "Pedido creado", id: result.insertId });
  } catch (error) {
    console.error("❌ Error al crear pedido:", error.message);
    res.status(500).json({ error: "Error al crear pedido" });
  }
});

// Ver todos los pedidos (admin)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, u.correo AS usuario, pr.nombre AS producto
      FROM pedidos p
      JOIN usuarios u ON p.id_usuario = u.id
      JOIN productos pr ON p.id_producto = pr.id
      ORDER BY p.id DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener pedidos:", error.message);
    res.status(500).json({ error: "Error al obtener pedidos" });
  }
});

// Eliminar pedido (solo admin)
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await pool.query("DELETE FROM pedidos WHERE id=?", [id]);
    res.json({ message: "Pedido eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar pedido:", error.message);
    res.status(500).json({ error: "Error al eliminar pedido" });
  }
});

export default router;

