// import pool from "../db/pool.js";
// import bcrypt from "bcrypt";

// const insertData = async (req, res) => {
//   try {
//     const users = [
//       { correo: "paa@aasd.asd", pass: "111", rol: "normal" },
//       { correo: "adn@as.com", pass: "123", rol: "administrador" },
//     ];

//     for (const user of users) {
//       const hashed = await bcrypt.hash(user.pass, 10);
//       await pool.query(
//         `
//         INSERT INTO usuarios (correo, contrasena, rol)
//         VALUES ($1, $2, $3)
//         ON CONFLICT (correo)
//         DO UPDATE SET contrasena = EXCLUDED.contrasena, rol = EXCLUDED.rol;
//         `,
//         [user.correo, hashed, user.rol]
//       );
//     }

//     res.send("✅ Usuarios creados o actualizados correctamente.");
//   } catch (error) {
//     console.error("❌ Error al insertar datos:", error);
//     res.status(500).send(`❌ Error SQL: ${error.message}`);
//   }
// };

// export default insertData;

import pool from "../db/pool.js"; // Asegúrate de tener configurada tu conexión
//import bcrypt from "bcrypt"; // No necesario aquí, pero lo dejo si usas la misma estructura

const insertData = async (req, res) => {
  console.log("holas");

  try {
    const productos = [
      {
        nombre: "Camiseta básica",
        descripcion: "Camiseta de algodón color blanco",
        cantidad: 50,
        talla: "M",
        precio: 15.99,
      },
      {
        nombre: "Pantalón jeans",
        descripcion: "Jeans azul clásico",
        cantidad: 30,
        talla: "L",
        precio: 39.99,
      },
    ];

    for (const p of productos) {
      const exists = await pool.query(
        `SELECT id FROM inventario WHERE nombre = $1 LIMIT 1`,
        [p.nombre]
      );

      if (exists.rows.length > 0) {
        // actualizar
        await pool.query(
          `UPDATE inventario
       SET descripcion=$1, cantidad=$2, talla=$3, precio=$4, fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE id = $5`,
          [p.descripcion, p.cantidad, p.talla, p.precio, exists.rows[0].id]
        );
      } else {
        // insertar
        await pool.query(
          `INSERT INTO inventario (nombre, descripcion, cantidad, talla, precio)
       VALUES ($1, $2, $3, $4, $5)`,
          [p.nombre, p.descripcion, p.cantidad, p.talla, p.precio]
        );
      }
    }

    res.send("✅ Productos creados o actualizados correctamente.");
  } catch (error) {
    console.error("❌ Error al insertar datos:", error);
    res.status(500).send(`❌ Error SQL: ${error.message}`);
  }
};

export default insertData;
