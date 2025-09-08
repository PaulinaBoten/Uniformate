import express from "express";
import pool from "../db.js";

const router = express.Router();

// Crear pedido (estudiante)
router.post("/", async (req, res) => {
  const { usuario_id, inventario_id, cantidad } = req.body;
  const [result] = await pool.query(
    "INSERT INTO pedidos (usuario_id, inventario_id, cantidad) VALUES (?, ?, ?)",
    [usuario_id, inventario_id, cantidad]
  );
  res.json({ message: "Pedido creado", id: result.insertId });
});

// Ver todos los pedidos (admin)
router.get("/", async (req, res) => {
  const [rows] = await pool.query(`
    SELECT p.id, u.correo, i.nombre, p.cantidad, p.estado, p.fecha
    FROM pedidos p
    JOIN usuarios u ON p.usuario_id = u.id
    JOIN inventario i ON p.inventario_id = i.id
  `);
  res.json(rows);
});

// Aceptar pedido (rebaja inventario)
router.put("/:id/aceptar", async (req, res) => {
  const id = req.params.id;

  await pool.query("UPDATE pedidos SET estado='aceptado' WHERE id=?", [id]);
  await pool.query(`
    UPDATE inventario 
    SET cantidad = cantidad - (SELECT cantidad FROM pedidos WHERE id=?)
    WHERE id = (SELECT inventario_id FROM pedidos WHERE id=?)
  `, [id, id]);

  res.json({ message: "Pedido aceptado y stock actualizado" });
});

// Rechazar pedido
router.put("/:id/rechazar", async (req, res) => {
  const id = req.params.id;
  await pool.query("UPDATE pedidos SET estado='rechazado' WHERE id=?", [id]);
  res.json({ message: "Pedido rechazado" });
});

export default router;
