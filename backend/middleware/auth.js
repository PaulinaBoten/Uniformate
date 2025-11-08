import jwt from "jsonwebtoken";

export function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token requerido" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Token inválido" });
  }
}

export function soloAdmin(req, res, next) {
  if (req.user.rol !== "admin") {
    return res.status(403).json({ error: "Acceso solo para administradores" });
  }
  next();
}

export function soloEstudiante(req, res, next) {
  if (req.user.rol !== "estudiante") {
    return res.status(403).json({ error: "Acceso solo para estudiantes" });
  }
  next();
}
