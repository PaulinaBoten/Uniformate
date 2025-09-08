import express from "express";
import pool from "../db.js";

const router = express.Router();

// Obtener inventario
router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM inventario");
  res.json(rows);
});

// Agregar uniforme (solo admin)
router.post("/", async (req, res) => {
  const { nombre, descripcion, cantidad, talla, precio } = req.body;
  const [result] = await pool.query(
    "INSERT INTO inventario (nombre, descripcion, cantidad, talla, precio) VALUES (?, ?, ?, ?, ?)",
    [nombre, descripcion, cantidad, talla, precio]
  );
  res.json({ message: "Uniforme agregado", id: result.insertId });
});

export default router;
