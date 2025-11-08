// backend/routes/productos.js

import express from "express";
import pool from "../db/pool.js";

const router = express.Router();

/**
 * 📦 Obtener todos los productos
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM productos");
    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error.message);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

/**
 * ➕ Agregar un nuevo producto (solo administradores)
 */
router.post("/", async (req, res) => {
  try {
    const { nombre, descripcion, talla, stock } = req.body;

    // Validaciones básicas
    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
      return res.status(400).json({ error: "El nombre del producto es obligatorio" });
    }

    const stockFinal = Number.isInteger(stock) ? stock : 0;

    const [result] = await pool.query(
      "INSERT INTO productos (nombre, descripcion, talla, stock) VALUES (?, ?, ?, ?)",
      [nombre.trim(), descripcion || null, talla || null, stockFinal]
    );

    res.status(201).json({
      message: "✅ Producto agregado correctamente",
      productoId: result.insertId,
    });
  } catch (error) {
    console.error("❌ Error al agregar producto:", error.message);
    res.status(500).json({ error: "Error al agregar el producto" });
  }
});

/**
 * 🗑️ Eliminar un producto por ID (solo admin)
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM productos WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "🗑️ Producto eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error.message);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

/**
 * ✏️ Actualizar producto por ID
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, talla, stock } = req.body;

    const [result] = await pool.query(
      "UPDATE productos SET nombre = ?, descripcion = ?, talla = ?, stock = ? WHERE id = ?",
      [nombre, descripcion, talla, stock, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "✏️ Producto actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar producto:", error.message);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

export default router;
