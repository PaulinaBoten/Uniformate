import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

/**
 * 🧾 Registro de usuario
 * Crea un nuevo usuario con correo, contraseña y rol opcional.
 */
router.post("/register", async (req, res, next) => {
  try {
    await register(req, res);
  } catch (error) {
    console.error("❌ Error en /register:", error.message);
    next(error);
  }
});

/**
 * 🔐 Inicio de sesión
 * Valida las credenciales del usuario y devuelve un token JWT.
 */
router.post("/login", async (req, res, next) => {
  try {
    await login(req, res);
  } catch (error) {
    console.error("❌ Error en /login:", error.message);
    next(error);
  }
});

export default router;
