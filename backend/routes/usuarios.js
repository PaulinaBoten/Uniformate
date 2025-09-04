import express from "express";
import pool from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Registro
router.post("/registro", async (req, res) => {
  const { correo, contrasena, rol } = req.body;
  const hash = await bcrypt.hash(contrasena, 10);

  try {
    const [result] = await pool.query(
      "INSERT INTO usuarios (correo, contrasena, rol) VALUES (?, ?, ?)",
      [correo, hash, rol || "estudiante"]
    );
    res.json({ message: "Usuario registrado", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { correo, contrasena } = req.body;

  const [rows] = await pool.query("SELECT * FROM usuarios WHERE correo = ?", [correo]);
  if (rows.length === 0) return res.status(401).json({ error: "Usuario no encontrado" });

  const usuario = rows[0];
  const valido = await bcrypt.compare(contrasena, usuario.contrasena);
  if (!valido) return res.status(401).json({ error: "Contraseña incorrecta" });

  const token = jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    process.env.JWT_SECRET || "secreto",
    { expiresIn: "1h" }
  );

  res.json({ message: "Login correcto", token });
});

export default router;
