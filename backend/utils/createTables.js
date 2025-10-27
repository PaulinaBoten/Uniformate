// utils/createTables.js
import pool from "../db/pool.js";

const createTables = async (req, res) => {
  try {
    console.log("🧱 Recreando tablas (PostgreSQL)...");

    await pool.query("BEGIN;");

    // Eliminar tablas en orden inverso a dependencias
    await pool.query("DROP TABLE IF EXISTS pedidos CASCADE;");
    await pool.query("DROP TABLE IF EXISTS inventario CASCADE;");
    await pool.query("DROP TABLE IF EXISTS usuarios CASCADE;");

    // Crear tabla usuarios
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        correo VARCHAR(100) UNIQUE NOT NULL,
        contrasena VARCHAR(255) NOT NULL,
        rol VARCHAR(20) DEFAULT 'normal' CHECK (rol IN ('administrador', 'normal')),
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Crear tabla inventario
    await pool.query(`
      CREATE TABLE IF NOT EXISTS inventario (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        cantidad INT DEFAULT 0,
        talla VARCHAR(10),
        precio DECIMAL(10,2) DEFAULT 0.00,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Crear tabla pedidos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id SERIAL PRIMARY KEY,
        usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        inventario_id INT NOT NULL REFERENCES inventario(id) ON DELETE CASCADE,
        cantidad INT NOT NULL,
        estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aceptado', 'rechazado')),
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query("COMMIT;");

    res.send("✅ Tablas creadas correctamente en PostgreSQL.");
  } catch (error) {
    await pool.query("ROLLBACK;");
    console.error("❌ Error al crear tablas:", error);
    res.status(500).send(`❌ Error SQL: ${error.message}`);
  }
};

export default createTables;
