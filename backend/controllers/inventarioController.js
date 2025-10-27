import pool from "../db/pool.js";

/**
 * 📋 Obtener todos los productos
 */
export const obtenerProductos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM inventario ORDER BY id ASC");
    console.log(`✅ ${result.rowCount} productos encontrados`);
    if (result.rowCount === 0) {
      console.warn("⚠️ No hay productos en el inventario");
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error.message);
    res.status(500).json({ error: "Error interno al obtener productos" });
  }
};
