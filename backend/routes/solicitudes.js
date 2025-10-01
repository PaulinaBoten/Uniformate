// backend/routes/solicitudes.js (anteriormente pedidos.js)
import express from "express";
import pool from "../db.js";

// Suponemos que tienes un middleware para verificar el token y extraer userId y userRole
// import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware de ejemplo para simular la verificación de token y rol
// En un proyecto real, reemplazarías esto con tu middleware real de autenticación.
const simulateAuth = (req, res, next) => {
  // Simula que el usuario está autenticado como 'estudiante' con ID 1
  req.userId = 1;
  req.userRole = 'estudiante';
  req.userName = 'Niña de Prueba';
  // Si quieres simular un admin, cambia estos valores
  // req.userId = 2;
  // req.userRole = 'administrador';
  // req.userName = 'Administrador Principal';
  next();
};

const verifyAdmin = (req, res, next) => {
    if (req.userRole === 'administrador') {
        next();
    } else {
        return res.status(403).json({ error: "Acceso denegado. Solo administradores." });
    }
};

// Solicitar uniformes (usuario/estudiante)
router.post("/", simulateAuth, async (req, res) => {
  const { uniformesSolicitados } = req.body; // `uniformesSolicitados` será un array de {id_uniforme}

  if (!req.userId) {
    return res.status(401).json({ error: "Usuario no autenticado." });
  }

  if (!uniformesSolicitados || uniformesSolicitados.length === 0) {
    return res.status(400).json({ error: "La solicitud no contiene uniformes." });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Verificar disponibilidad y marcar como no disponibles temporalmente
    const uniformesParaSolicitar = [];
    for (const item of uniformesSolicitados) {
      const [uniformeRows] = await connection.query(
        "SELECT id, nombre, talla, disponible FROM uniformes_disponibles WHERE id = ?",
        [item.id_uniforme]
      );

      if (uniformeRows.length === 0) {
        throw new Error(`Uniforme con ID ${item.id_uniforme} no encontrado.`);
      }
      const uniforme = uniformeRows[0];

      if (!uniforme.disponible) {
        throw new Error(`El uniforme "${uniforme.nombre} - Talla ${uniforme.talla}" (ID ${uniforme.id}) ya no está disponible.`);
      }
      uniformesParaSolicitar.push(uniforme);
    }

    // 2. Insertar la solicitud principal
    const [solicitudResult] = await connection.query(
      "INSERT INTO solicitudes (id_usuario, estado) VALUES (?, 'pendiente')",
      [req.userId]
    );
    const solicitudId = solicitudResult.insertId;

    // 3. Insertar los detalles de la solicitud y marcar uniformes como no disponibles
    for (const uniforme of uniformesParaSolicitar) {
      await connection.query(
        "INSERT INTO detalles_solicitud (id_solicitud, id_uniforme, cantidad) VALUES (?, ?, 1)", // Siempre cantidad 1 por ítem
        [solicitudId, uniforme.id]
      );
      // Marcar el uniforme como no disponible inmediatamente para evitar doble solicitud
      await connection.query(
        "UPDATE uniformes_disponibles SET disponible = FALSE WHERE id = ?",
        [uniforme.id]
      );
    }

    await connection.commit();
    res.status(201).json({ message: "Solicitud creada exitosamente", id_solicitud: solicitudId });

  } catch (error) {
    await connection.rollback();
    console.error("❌ Error al crear solicitud:", error.message);
    res.status(500).json({ error: "Error al crear solicitud: " + error.message });
  } finally {
    connection.release();
  }
});

// Ver todas las solicitudes (admin)
router.get("/", simulateAuth, verifyAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        s.id AS id_solicitud,
        u.correo AS usuario_correo,
        u.nombre_completo AS usuario_nombre,
        s.fecha_solicitud,
        s.estado,
        GROUP_CONCAT(CONCAT(ds.cantidad, 'x ', ud.nombre, ' (Talla: ', ud.talla, ', Condición: ', ud.estado_conservacion, ')')) AS uniformes_detalle
      FROM solicitudes s
      JOIN usuarios u ON s.id_usuario = u.id
      LEFT JOIN detalles_solicitud ds ON s.id = ds.id_solicitud
      LEFT JOIN uniformes_disponibles ud ON ds.id_uniforme = ud.id
      GROUP BY s.id
      ORDER BY s.fecha_solicitud DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener solicitudes:", error.message);
    res.status(500).json({ error: "Error al obtener solicitudes" });
  }
});

// Ver solicitudes de un usuario específico (solo ese usuario o admin)
router.get("/my-requests", simulateAuth, async (req, res) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ error: "Usuario no autenticado." });
    }

    try {
        const [rows] = await pool.query(`
            SELECT
                s.id AS id_solicitud,
                u.correo AS usuario_correo,
                u.nombre_completo AS usuario_nombre,
                s.fecha_solicitud,
                s.estado,
                GROUP_CONCAT(CONCAT(ds.cantidad, 'x ', ud.nombre, ' (Talla: ', ud.talla, ', Condición: ', ud.estado_conservacion, ')')) AS uniformes_detalle
            FROM solicitudes s
            JOIN usuarios u ON s.id_usuario = u.id
            LEFT JOIN detalles_solicitud ds ON s.id = ds.id_solicitud
            LEFT JOIN uniformes_disponibles ud ON ds.id_uniforme = ud.id
            WHERE s.id_usuario = ?
            GROUP BY s.id
            ORDER BY s.fecha_solicitud DESC
        `, [userId]);
        res.json(rows);
    } catch (error) {
        console.error("❌ Error al obtener solicitudes del usuario:", error.message);
        res.status(500).json({ error: "Error al obtener solicitudes del usuario" });
    }
});

// Eliminar solicitud (solo admin) - Opcional, quizás solo cambiar estado a "rechazada"
router.delete("/:id", simulateAuth, verifyAdmin, async (req, res) => {
  const id = req.params.id;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Obtener los uniformes asociados a la solicitud para volver a marcarlos como disponibles
    const [detalles] = await connection.query("SELECT id_uniforme FROM detalles_solicitud WHERE id_solicitud = ?", [id]);

    // Eliminar la solicitud (ON DELETE CASCADE se encargará de detalles_solicitud)
    const [result] = await connection.query("DELETE FROM solicitudes WHERE id=?", [id]);

    if (result.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ message: "Solicitud no encontrada." });
    }

    // Volver a marcar los uniformes como disponibles si la solicitud se elimina
    for (const detalle of detalles) {
        await connection.query("UPDATE uniformes_disponibles SET disponible = TRUE WHERE id = ?", [detalle.id_uniforme]);
    }

    await connection.commit();
    res.json({ message: "Solicitud eliminada correctamente y uniformes liberados." });
  } catch (error) {
    await connection.rollback();
    console.error("❌ Error al eliminar solicitud:", error.message);
    res.status(500).json({ error: "Error al eliminar solicitud" });
  } finally {
    connection.release();
  }
});

// Actualizar el estado de una solicitud (solo admin)
router.put("/:id/estado", simulateAuth, verifyAdmin, async (req, res) => {
    const solicitudId = req.params.id;
    const { nuevoEstado } = req.body;

    if (!nuevoEstado) {
        return res.status(400).json({ error: "Falta el nuevo estado de la solicitud." });
    }

    const estadosValidos = ['pendiente', 'aprobada', 'rechazada', 'entregada'];
    if (!estadosValidos.includes(nuevoEstado)) {
        return res.status(400).json({ error: "Estado de solicitud inválido." });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [currentStatusRows] = await connection.query("SELECT estado FROM solicitudes WHERE id = ?", [solicitudId]);
        if (currentStatusRows.length === 0) {
             await connection.rollback();
             return res.status(404).json({ message: "Solicitud no encontrada." });
        }
        const currentStatus = currentStatusRows[0].estado;

        // Lógica para manejar cambios de disponibilidad de uniformes según el estado
        if (nuevoEstado === 'rechazada' && currentStatus !== 'rechazada') {
            // Si se rechaza, los uniformes vuelven a estar disponibles
            const [detalles] = await connection.query("SELECT id_uniforme FROM detalles_solicitud WHERE id_solicitud = ?", [solicitudId]);
            for (const detalle of detalles) {
                await connection.query("UPDATE uniformes_disponibles SET disponible = TRUE WHERE id = ?", [detalle.id_uniforme]);
            }
        } else if (nuevoEstado === 'aprobada' && currentStatus !== 'aprobada') {
             // Si se aprueba, nos aseguramos que los uniformes queden no disponibles (ya deberían estarlo desde la creación)
             // Esto es más bien una re-verificación o para estados que no se marcaron al crear.
             const [detalles] = await connection.query("SELECT id_uniforme FROM detalles_solicitud WHERE id_solicitud = ?", [solicitudId]);
             for (const detalle of detalles) {
                 await connection.query("UPDATE uniformes_disponibles SET disponible = FALSE WHERE id = ?", [detalle.id_uniforme]);
             }
        }
        // Para 'entregada', los uniformes ya deben estar no disponibles.

        const [result] = await connection.query(
            "UPDATE solicitudes SET estado = ? WHERE id = ?",
            [nuevoEstado, solicitudId]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Solicitud no encontrada." });
        }

        await connection.commit();
        res.json({ message: `Estado de la solicitud ${solicitudId} actualizado a '${nuevoEstado}'` });
    } catch (error) {
        await connection.rollback();
        console.error("❌ Error al actualizar estado de la solicitud:", error.message);
        res.status(500).json({ error: "Error al actualizar estado de la solicitud: " + error.message });
    } finally {
        connection.release();
    }
});


export default router;