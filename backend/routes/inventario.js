// backend/routes/inventario.js

import express from "express";
import { verificarToken, soloAdmin } from "../middleware/auth.js";
import {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
} from "../controllers/inventarioController.js";

const router = express.Router();

/**
 * 📦 Obtener todos los productos
 */
router.get("/", verificarToken, async (req, res, next) => {
  try {
    await obtenerProductos(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * 🔍 Obtener un producto por su ID
 */
router.get("/:id", verificarToken, async (req, res, next) => {
  try {
    await obtenerProductoPorId(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * ➕ Crear un producto (solo administradores)
 */
router.post("/", verificarToken, soloAdmin, async (req, res, next) => {
  try {
    await crearProducto(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * ✏️ Actualizar un producto (solo administradores)
 */
router.put("/:id", verificarToken, soloAdmin, async (req, res, next) => {
  try {
    await actualizarProducto(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * 🗑️ Eliminar un producto (solo administradores)
 */
router.delete("/:id", verificarToken, soloAdmin, async (req, res, next) => {
  try {
    await eliminarProducto(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
