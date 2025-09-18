// utils/insertData.js (CORREGIDO)

const pool = require('../db/pool');
const bcrypt = require('bcrypt');

const insertData = async (req, res) => {
  try {
    // Hashea la contraseña '123'
    const hashedPassword = await bcrypt.hash('123', 10);

    // Definimos el correo y el rol para este usuario de prueba
    const userEmail = 'pa@asd.asd'; // O cualquier otro correo que quieras usar
    const userRole = 'normal'; // O 'administrador'

    // Realizar la inserción
    await pool.query(`
      INSERT INTO usuarios (correo, contrasena, rol)
      VALUES ($1, $2, $3)
      ON CONFLICT (correo) DO NOTHING; -- Para evitar errores si el correo ya existe
    `, [userEmail, hashedPassword, userRole]); // Ahora pasamos 3 valores para 3 columnas

    res.send('✅ Dato creado correctamente'); // Mensaje corregido
  } catch (error) {
    console.error('❌ Error al insertar datos:', error.message); // Mensaje de consola corregido
    res.status(500).send(`❌ Error al insertar los datos: ${error.message}`); // Mensaje de respuesta corregido
  }
};

module.exports = insertData;