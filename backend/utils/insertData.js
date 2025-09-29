// utils/insertData.js (Modificado para incluir usuario administrador)

const pool = require('../db/pool');
const bcrypt = require('bcrypt');

const insertData = async (req, res) => {
  try {
    // Hashea la contraseña para el usuario normal (ej. 'pa@asd.asd')
    const normalUserPassword = '123';
    const hashedNormalPassword = await bcrypt.hash(normalUserPassword, 10);
    const normalUserEmail = 'pa@asd.asd';

    // Inserta o actualiza el usuario normal
    await pool.query(`
      INSERT INTO usuarios (correo, contrasena, rol)
      VALUES ($1, $2, $3)
      ON CONFLICT (correo) DO UPDATE SET
        contrasena = EXCLUDED.contrasena,
        rol = EXCLUDED.rol;
    `, [normalUserEmail, hashedNormalPassword, 'normal']);

    // --- NUEVO: Usuario Administrador ---
    const adminUserPassword = 'adminpassword123'; // ¡Contraseña para el administrador!
    const hashedAdminPassword = await bcrypt.hash(adminUserPassword, 10);
    const adminUserEmail = 'admin@uniformate.com'; // Correo del administrador

    // Inserta o actualiza el usuario administrador
    await pool.query(`
      INSERT INTO usuarios (correo, contrasena, rol)
      VALUES ($1, $2, $3)
      ON CONFLICT (correo) DO UPDATE SET
        contrasena = EXCLUDED.contrasena,
        rol = EXCLUDED.rol;
    `, [adminUserEmail, hashedAdminPassword, 'administrador']); // ¡IMPORTANTE: rol 'administrador'!

    res.send('✅ Datos de usuarios creados/actualizados correctamente');
  } catch (error) {
    console.error('❌ Error al insertar/actualizar datos:', error.message);
    res.status(500).send(`❌ Error al insertar/actualizar los datos: ${error.message}`);
  }
};

module.exports = insertData;