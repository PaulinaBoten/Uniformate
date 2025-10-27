import pool from "../db/pool.js";
import bcrypt from "bcrypt";

const insertData = async (req, res) => {
  try {
    const users = [
      { correo: "paa@aasd.asd", pass: "111", rol: "normal" },
      { correo: "adn@as.com", pass: "123", rol: "administrador" },
    ];

    for (const user of users) {
      const hashed = await bcrypt.hash(user.pass, 10);
      await pool.query(
        `
        INSERT INTO usuarios (correo, contrasena, rol)
        VALUES ($1, $2, $3)
        ON CONFLICT (correo)
        DO UPDATE SET contrasena = EXCLUDED.contrasena, rol = EXCLUDED.rol;
        `,
        [user.correo, hashed, user.rol]
      );
    }

    res.send("✅ Usuarios creados o actualizados correctamente.");
  } catch (error) {
    console.error("❌ Error al insertar datos:", error);
    res.status(500).send(`❌ Error SQL: ${error.message}`);
  }
};

export default insertData;
