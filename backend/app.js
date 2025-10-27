import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import inventarioRoutes from "./routes/inventario.js";
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
app.use("/inventario", inventarioRoutes);//
app.use("/reviews", reviewRoutes);

// 🔧 Crear tablas
app.get("/create-tables", createTables);
app.get("/insert-data", insertData);

// 🧩 Test de conexión con BD
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    res.json({ db_time: result.rows[0].now });
  } catch (error) {
    console.error("❌ Error al conectar con la BD:", error.message);
    res.status(500).json({ error: "Error de conexión a la BD" });
  }
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));

export default app;
