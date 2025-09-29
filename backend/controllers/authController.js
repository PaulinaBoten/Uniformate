const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

// Registro de usuario
exports.register = async (req, res) => {
  const { correo, contrasena, rol = 'normal' } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const result = await pool.query(
      'INSERT INTO usuarios (correo, contrasena, rol) VALUES ($1, $2, $3) RETURNING id, correo, rol',
      [correo, hashedPassword, rol]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error.message);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  const { correo, contrasena } = req.body;
  console.log(await pool.query('SELECT * FROM usuarios'));
  

  try {
    console.log(correo);
    const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    
    if (result.rows.length === 0) return res.status(400).json({ error: 'Usuario no encontrado' });

    const user = result.rows[0];
    console.log(user);
    
    const match = await bcrypt.compare(contrasena, user.contrasena);
    if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      token,
      user: { id: user.id, correo: user.correo, rol: user.rol },
    });
  } catch (error) {
    console.error('❌ Error al iniciar sesión:', error.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};


