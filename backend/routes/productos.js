import express from "express";
import pool from "../db.js";

const router = express.Router();

// Obtener productos
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM productos");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error.message);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Agregar producto (ej: uniforme) -- solo admin
router.post("/", async (req, res) => {
  const { nombre, descripcion, talla, stock } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: "El nombre es obligatorio" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO productos (nombre, descripcion, talla, stock) VALUES (?, ?, ?, ?)",
      [nombre, descripcion, talla, stock || 0]
    );
    res.json({ message: "Producto agregado", id: result.insertId });
  } catch (error) {
    console.error("❌ Error al agregar producto:", error.message);
    res.status(500).json({ error: "Error al agregar producto" });
  }
});

export default router;
