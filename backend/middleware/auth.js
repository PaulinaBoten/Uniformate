import jwt from "jsonwebtoken";

export function verificarToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "Token requerido" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
}

export function soloAdmin(req, res, next) {
  if (req.usuario.rol !== "admin") {
    return res.status(403).json({ error: "Acceso solo para administradores" });
  }
  next();
}

export function soloEstudiante(req, res, next) {
  if (req.usuario.rol !== "estudiante") {
    return res.status(403).json({ error: "Acceso solo para estudiantes" });
  }
  next();
}