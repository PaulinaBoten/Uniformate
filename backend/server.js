// backend/server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

// 🔗 Importar rutas
import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

// 🔧 Importar utilidades y conexión a la BD
import createTables from "./utils/createTables.js";
import insertData from "./utils/insertData.js";
import pool from "./db/pool.js";

// Inicializar app
const app = express();

// 🌍 Middlewares globales
app.use(cors());
app.use(express.json());

// 🧭 Rutas principales
app.use("/auth", authRoutes);
app.use("/reviews", reviewRoutes);

// 🔧 Ruta para insertar datos (solo desarrollo)
app.get("/insert-user", async (req, res) => {
  try {
    await insertData(req, res);
  } catch (error) {
    console.error("❌ Error al insertar usuario:", error.message);
    res.status(500).json({ error: "Error al insertar usuario" });
  }
});

// ⚙️ Ruta para crear tablas
app.get("/create-tables", async (req, res) => {
  try {
    await createTables(req, res);
  } catch (error) {
    console.error("❌ Error al crear tablas:", error.message);
    res.status(500).json({ error: "Error al crear tablas" });
  }
});

// 🧩 Test de conexión con la BD
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS now");
    res.json({ db_time: rows[0].now });
  } catch (error) {
    console.error("❌ Error al conectar con la BD:", error.message);
    res.status(500).json({ error: "Error de conexión a la BD" });
  }
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
