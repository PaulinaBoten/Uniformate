const pool = require('../db/pool');

const createTables = async (req, res) => {
  try {
    await pool.query(`
      INSERT INTO users (
        name ,
        email ,
        password ,
        is_admin
      ) VALUES()
       
    `);
    res.send('✅ Data creada correctamente');
  } catch (error) {
    console.error('❌ Error al crear tablas:', error.message);
    res.status(500).send('❌ Error al crear las tablas');
  }
};

module.exports = insertData;