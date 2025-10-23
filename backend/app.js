import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import createTables from "./utils/createTables.js";
import pool from "./db/pool.js";
import insertData from "./utils/insertData.js";

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

// ⚙️ Ruta para crear tablas (solo en desarrollo)
app.get("/create-tables", async (req, res) => {
  try {
    await createTables(req, res);
  } catch (error) {
    console.error("❌ Error al crear tablas:", error.message);
    res.status(500).json({ error: "Error al crear tablas" });
  }
});

// 🧩 Probar conexión con la base de datos
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS now");
    res.json({ db_time: rows[0].now });
  } catch (error) {
    console.error("❌ Error al conectar con la BD:", error.message);
    res.status(500).json({ error: "Error de conexión a la BD" });
  }
});

// 🗑 Eliminar tabla de reviews
app.get("/drop-reviews", async (req, res) => {
  try {
    await pool.query("DROP TABLE IF EXISTS reviews;");
    res.send("🗑 Tabla 'reviews' eliminada correctamente.");
  } catch (error) {
    console.error("❌ Error al eliminar tabla reviews:", error.message);
    res.status(500).send("Error al eliminar tabla");
  }
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
