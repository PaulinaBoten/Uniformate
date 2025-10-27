// backend/routes/inventario.js
import express from "express";
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

// 🔍 Obtener producto por ID
router.get("/:id", obtenerProductoPorId);

// ➕ Crear producto
router.post("/", crearProducto);//

// ✏️ Actualizar producto
router.put("/:id", actualizarProducto);

// 🗑️ Eliminar producto
router.delete("/:id", eliminarProducto);

export default router;
