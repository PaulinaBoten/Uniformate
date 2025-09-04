import express from "express";
import usuariosRoutes from "./routes/usuarios.js";
import inventarioRoutes from "./routes/inventario.js";
import pedidosRoutes from "./routes/pedidos.js";

const app = express();
app.use(express.json());

// Rutas
app.use("/usuarios", usuariosRoutes);
app.use("/inventario", inventarioRoutes);
app.use("/pedidos", pedidosRoutes);

app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});
