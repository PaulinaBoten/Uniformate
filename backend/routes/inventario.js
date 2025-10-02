import express from "express";
import { verificarToken, soloAdmin } from "../middleware/auth.js";
import {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto
} from "../controllers/inventarioController.js";

const router = express.Router();

// Leer todos los productos
router.get("/", verificarToken, obtenerProductos);

// Leer producto por ID
router.get("/:id", verificarToken, obtenerProductoPorId);

// Crear producto (solo admin)
router.post("/", verificarToken, soloAdmin, crearProducto);

// Actualizar producto (solo admin)
router.put("/:id", verificarToken, soloAdmin, actualizarProducto);

// Eliminar producto (solo admin)
router.delete("/:id", verificarToken, soloAdmin, eliminarProducto);

export default router;