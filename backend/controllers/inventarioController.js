// controllers/inventarioController.js
import pool from "../db/pool.js";

/**
 * 🧩 Crear producto
 */
export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, cantidad, talla, precio } = req.body;

    // Validaciones básicas
    if (!nombre) {
      return res.status(400).json({ error: "El nombre del producto es obligatorio" });
    }
    if (cantidad != null && isNaN(cantidad)) {
      return res.status(400).json({ error: "La cantidad debe ser un número" });
    }
    if (precio != null && isNaN(precio)) {
      return res.status(400).json({ error: "El precio debe ser un número" });
    }

    const [result] = await pool.query(
      "INSERT INTO inventario (nombre, descripcion, cantidad, talla, precio) VALUES (?, ?, ?, ?, ?)",
      [nombre, descripcion || null, cantidad || 0, talla || null, precio || 0.0]
    );

    res.status(201).json({
      message: "✅ Producto creado correctamente",
      id: result.insertId,
    });
  } catch (error) {
    console.error("❌ Error al crear producto:", error.message);
    res.status(500).json({ error: "Error interno al crear el producto" });
  }
};

/**
 * 📋 Obtener todos los productos
 */
export const obtenerProductos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM inventario ORDER BY id DESC");
    res.json(rows);
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
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const [rows] = await pool.query("SELECT * FROM inventario WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener producto:", error.message);
    res.status(500).json({ error: "Error interno al obtener producto" });
  }
};

/**
 * ✏️ Actualizar producto
 */
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, cantidad, talla, precio } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const [result] = await pool.query(
      "UPDATE inventario SET nombre=?, descripcion=?, cantidad=?, talla=?, precio=? WHERE id=?",
      [nombre, descripcion, cantidad, talla, precio, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado para actualizar" });
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

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const [result] = await pool.query("DELETE FROM inventario WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado para eliminar" });
    }

    res.json({ message: "✅ Producto eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error.message);
    res.status(500).json({ error: "Error interno al eliminar producto" });
  }
};
