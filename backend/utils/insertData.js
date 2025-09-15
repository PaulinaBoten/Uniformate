// utils/insertData.js

const pool = require('../db/pool');
const bcrypt = require('bcrypt');

const insertData = async (req, res) => {
  try {
    // Hashea la contraseña '123456789'
    const hashedPassword = await bcrypt.hash('123456789', 10); // ¡CAMBIO AQUÍ!

    // Definimos el correo y el rol para este usuario de prueba
    const userEmail = 'passsa@asd.asd'; // O cualquier otro correo que quieras usar
    const userRole = 'normal'; // O 'administrador'

    // Realizar la inserción
    await pool.query(`
      INSERT INTO usuarios (correo, contrasena, rol)
      VALUES ($1, $2, $3)
      ON CONFLICT (correo) DO NOTHING;
    `, [userEmail, hashedPassword, userRole]);

    res.send('✅ Dato creado correctamente');
  } catch (error) {
    console.error('❌ Error al insertar datos:', error.message);
    res.status(500).send(`❌ Error al insertar los datos: ${error.message}`);
  }
};

module.exports = insertData;