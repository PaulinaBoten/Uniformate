// routes/authRoutes.js
import express from "express";
import pool from "../db/pool.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// 🧩 REGISTRO DE USUARIO
router.post("/registro", async (req, res) => {
  try {
    const { correo, contrasena, rol } = req.body;

    // Validar campos
    if (!correo || !contrasena) {
      return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
    }

    // Verificar si el usuario ya existe
    const [existing] = await pool.query("SELECT id FROM usuarios WHERE correo = ?", [correo]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "El correo ya está registrado" });
    }

    // Hashear contraseña
    const hash = await bcrypt.hash(contrasena, 10);

    // Insertar usuario
    const [result] = await pool.query(
      "INSERT INTO usuarios (correo, contrasena, rol) VALUES (?, ?, ?)",
      [correo, hash, rol || "normal"]
    );

    res.status(201).json({ message: "✅ Usuario registrado correctamente", id: result.insertId });
  } catch (err) {
    console.error("❌ Error en /registro:", err.message);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

// 🔐 LOGIN DE USUARIO
router.post("/login", async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Validar campos
    if (!correo || !contrasena) {
      return res
        .status(400)
        .json({ error: "Correo y contraseña son obligatorios" });
    }

    // Buscar usuario por correo
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE correo = ?", [
      correo,
    ]);

    if (!rows || rows.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const usuario = rows[0];

    // Comparar contraseñas
    const valido = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!valido) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET || "secreto",
      { expiresIn: "1h" }
    );

    // Respuesta de éxito
    return res.json({
      message: "✅ Login correcto",
      token,
      usuario: {
        id: usuario.id,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (err) {
    console.error("❌ Error en /login:", err.message);
    return res.status(500).json({
      error: "Error interno en el servidor al intentar iniciar sesión",
    });
  }
});
