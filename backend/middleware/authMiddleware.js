// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

/**
 * 🛡️ Middleware para verificar token JWT
 */
function verificarToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token requerido o formato incorrecto" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("⚠️ JWT_SECRET no está definido en las variables de entorno");
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Guarda la info del usuario para los siguientes middlewares o controladores

    next();
  } catch (err) {
    console.error("❌ Error al verificar token:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "El token ha expirado" });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ error: "Token inválido" });
    }

    return res.status(500).json({ error: "Error interno de autenticación" });
  }
}

/**
 * 🔐 Middleware opcional: restringe acceso solo a administradores
 */
function soloAdmin(req, res, next) {
  if (!req.user || req.user.rol !== "admin") {
    return res.status(403).json({ error: "Acceso denegado: solo administradores" });
  }
  next();
}

module.exports = {
  verificarToken,
  soloAdmin,
};
