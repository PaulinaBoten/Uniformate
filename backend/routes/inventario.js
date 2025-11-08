// backend/routes/inventario.js
import express from "express";
import pool from "../db/pool.js";
import {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
} from "../controllers/inventarioController.js";

const router = express.Router();

// 📦 Obtener todos los productos
router.get("/", obtenerProductos);

// 🔄 Actualizar múltiples productos (usado por Admin.html)
router.put("/actualizar", async (req, res) => {
  try {
    const { productos } = req.body;

    if (!Array.isArray(productos)) {
      return res.status(400).json({ error: "El formato de productos no es válido" });
    }

    for (const p of productos) {
      await pool.query(
        `UPDATE inventario 
         SET nombre = $1, cantidad = $2, talla = $3 
         WHERE id = $4`,
        [p.nombre, p.cantidad, p.talla, p.id]
      );
    }

    res.json({ message: "✅ Inventario actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar múltiples productos:", error.message);
    res.status(500).json({ error: "Error al actualizar múltiples productos" });
  }
});

// 🔍 Obtener producto por ID
router.get("/:id", obtenerProductoPorId);

// ➕ Crear producto
router.post("/", crearProducto);

// ✏️ Actualizar producto por ID
router.put("/:id", actualizarProducto);

// 🗑️ Eliminar producto
router.delete("/:id", eliminarProducto);

export default router;
