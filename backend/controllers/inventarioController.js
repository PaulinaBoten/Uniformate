import pool from "../db/pool.js";

/**
 * 📋 Obtener todos los productos
 */
export const obtenerProductos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM inventario ORDER BY id ASC");
    console.log(`✅ ${result.rowCount} productos encontrados`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error.message);
    res.status(500).json({ error: "Error interno al obtener productos" });
  }
};

/**
 * 🔍 Obtener producto por ID
 */
export const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM inventario WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener producto:", error.message);
    res.status(500).json({ error: "Error interno al obtener producto" });
  }
};

/**
 * ➕ Crear producto//
 */
export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, cantidad, talla, precio } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: "El nombre del producto es obligatorio" });
    }

    const result = await pool.query(
      `INSERT INTO inventario (nombre, descripcion, cantidad, talla, precio)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [nombre, descripcion || "", cantidad || 0, talla || "", precio || 0]
    );

    res.status(201).json({ message: "✅ Producto creado correctamente", id: result.rows[0].id });
  } catch (error) {
    console.error("❌ Error al crear producto:", error.message);
    res.status(500).json({ error: "Error interno al crear producto" });
  }
};

/**
 * ✏️ Actualizar producto
 */
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, cantidad, talla, precio } = req.body;

    const result = await pool.query(
      `UPDATE inventario SET nombre=$1, descripcion=$2, cantidad=$3, talla=$4, precio=$5 WHERE id=$6 RETURNING *`,
      [nombre, descripcion, cantidad, talla, precio, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "✅ Producto actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar producto:", error.message);
    res.status(500).json({ error: "Error interno al actualizar producto" });
  }
};

/**
 * 🗑️ Eliminar producto
 */
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM inventario WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ message: "✅ Producto eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error.message);
    res.status(500).json({ error: "Error interno al eliminar producto" });
  }
};
