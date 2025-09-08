const pool = require('../db/pool');

const createTables = async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        correo VARCHAR(100) UNIQUE NOT NULL,
        contrasena TEXT NOT NULL,
        rol VARCHAR(20) CHECK (rol IN ('normal', 'administrador')) DEFAULT 'normal'
      );

      CREATE TABLE IF NOT EXISTS productos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        talla VARCHAR(10),
        stock INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS pedidos (
        id SERIAL PRIMARY KEY,
        id_usuario INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        id_producto INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE
      );
    `);
    res.send('✅ Tablas creadas correctamente');
  } catch (error) {
    console.error('❌ Error al crear tablas:', error.message);
    res.status(500).send('❌ Error al crear las tablas');
  }
};

module.exports = createTables;