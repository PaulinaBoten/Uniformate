// utils/insertData.js (Corregido para MySQL y ES Modules)
import pool from "../db/pool.js";
import bcrypt from "bcrypt";

const insertData = async (req, res) => {
  try {
    // === Usuario Normal ===
    const normalUserPassword = "123";
    const hashedNormalPassword = await bcrypt.hash(normalUserPassword, 10);
    const normalUserEmail = "pa@asd.asd";

    await pool.query(
      `
      INSERT INTO usuarios (correo, contrasena, rol)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        contrasena = VALUES(contrasena),
        rol = VALUES(rol);
      `,
      [normalUserEmail, hashedNormalPassword, "normal"]
    );

    // === Usuario Administrador ===
    const adminUserPassword = "adminpassword123";
    const hashedAdminPassword = await bcrypt.hash(adminUserPassword, 10);
    const adminUserEmail = "admin@uniformate.com";

    await pool.query(
      `
      INSERT INTO usuarios (correo, contrasena, rol)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        contrasena = VALUES(contrasena),
        rol = VALUES(rol);
      `,
      [adminUserEmail, hashedAdminPassword, "administrador"]
    );

    res.send("✅ Usuarios creados o actualizados correctamente.");
  } catch (error) {
    console.error("❌ Error al insertar o actualizar datos:", error.message);
    res
      .status(500)
      .send(`❌ Error al insertar o actualizar los datos: ${error.message}`);
  }
};

export default insertData;
