// utils/createTables.js (Corregido para MySQL y ES Modules)
import pool from "../db/pool.js";

const createTables = async (req, res) => {
  try {
    // ✅ Crear tabla usuarios
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        correo VARCHAR(100) UNIQUE NOT NULL,
        contrasena VARCHAR(255) NOT NULL,
        rol ENUM('administrador', 'normal') DEFAULT 'normal',
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ✅ Crear tabla inventario
    await pool.query(`
      CREATE TABLE IF NOT EXISTS inventario (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        cantidad INT DEFAULT 0,
        talla VARCHAR(10),
        precio DECIMAL(10,2) DEFAULT 0.00,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // ✅ Crear tabla pedidos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        inventario_id INT NOT NULL,
        cantidad INT NOT NULL,
        estado ENUM('pendiente', 'aceptado', 'rechazado') DEFAULT 'pendiente',
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_pedido_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        CONSTRAINT fk_pedido_inventario FOREIGN KEY (inventario_id) REFERENCES inventario(id) ON DELETE CASCADE
      );
    `);

    res.send("✅ Tablas creadas correctamente.");
  } catch (error) {
    console.error("❌ Error al crear tablas:", error.message);
    res
      .status(500)
      .send(`❌ Error al crear las tablas: ${error.message}`);
  }
};

export default createTables;
