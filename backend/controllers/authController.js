// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/pool.js";

/**
 * 🧩 Registro de usuario
 */
export const register = async (req, res) => {
  try {
    const { correo, contrasena, rol = "estudiante" } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
    }

    // Verificar si el usuario ya existe
    const [existe] = await pool.query("SELECT id FROM usuarios WHERE correo = ?", [correo]);
    if (existe.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const [result] = await pool.query(
      "INSERT INTO usuarios (correo, contrasena, rol) VALUES (?, ?, ?)",
      [correo, hashedPassword, rol]
    );

    res.status(201).json({
      message: "✅ Usuario registrado correctamente",
      usuario: {
        id: result.insertId,
        correo,
        rol,
      },
    });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error.message);
    res.status(500).json({ error: "Error interno al registrar usuario" });
  }
};

/**
 * 🔐 Login de usuario
 */
export const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
    }

    const [rows] = await pool.query("SELECT * FROM usuarios WHERE correo = ?", [correo]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET || "secretoTemporal123",
      { expiresIn: "2h" }
    );

    res.json({
      message: "✅ Inicio de sesión exitoso",
      token,
      usuario: {
        id: user.id,
        correo: user.correo,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error.message);
    res.status(500).json({ error: "Error interno en el servidor" });
  }
};
