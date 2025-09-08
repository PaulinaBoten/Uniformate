const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const createTables = require('./utils/createTables');
const pool = require('./db/pool');
const insertData = require('./utils/insertData');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/auth', authRoutes);
app.use('/reviews', reviewRoutes);

app.get('/insert-user', insertData);
// Ruta para crear las tablas (solo en desarrollo)
app.get('/create-tables', createTables);


// Ruta para probar conexión con la base de datos
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error al conectar con la BD:', error.message);
    res.status(500).json({ error: 'Error de conexión a la BD' });
  }
});

// Ruta opcional para eliminar tabla de reviews
app.get('/drop-reviews', async (req, res) => {
  try {
    await pool.query('DROP TABLE IF EXISTS reviews CASCADE;');
    res.send('🗑 Tabla reviews eliminada correctamente.');
  } catch (error) {
    console.error('❌ Error al eliminar tabla reviews:', error.message);
    res.status(500).send('Error al eliminar tabla');
  }
});

module.exports = app;