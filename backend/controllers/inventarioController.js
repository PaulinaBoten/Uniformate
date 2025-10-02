import pool from "../db.js";

// Crear producto
export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, cantidad, talla, precio } = req.body;
    const [result] = await pool.query(
      "INSERT INTO inventario (nombre, descripcion, cantidad, talla, precio) VALUES (?, ?, ?, ?, ?)",
      [nombre, descripcion, cantidad, talla, precio]
    );
    res.json({ message: "Producto creado", id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Leer todos los productos
export const obtenerProductos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM inventario");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Leer producto por ID
export const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM inventario WHERE id=?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar producto
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, cantidad, talla, precio } = req.body;
    await pool.query(
      "UPDATE inventario SET nombre=?, descripcion=?, cantidad=?, talla=?, precio=? WHERE id=?",
      [nombre, descripcion, cantidad, talla, precio, id]
    );
    res.json({ message: "Producto actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar producto
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM inventario WHERE id=?", [id]);
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};