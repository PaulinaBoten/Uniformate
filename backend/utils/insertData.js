const pool = require('../db/pool');

const insertData = async (req, res) => {
  try {
    // Insertar usuarios
    await pool.query(`
      INSERT INTO usuarios (correo, contrasena, rol)
      VALUES 
      ('chochete@email.com', 'cochete123456789', 'normal'),
      ('Ozuna@email.com', 'Ozuna12345678', 'administrador')
    `);
    
    res.send('✅ Datos insertados correctamente');
  } catch (error) {
    console.error('❌ Error al insertar datos:', error.message);
    res.status(500).send('❌ Error al insertar los datos');
  }
};

module.exports = insertData;
