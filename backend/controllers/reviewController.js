// controllers/reviewController.js

// Crear un review
const createReview = async (req, res) => {
  try {
    const { comentario, rating } = req.body;
    const id_usuario = req.user.id; // viene del token

    // Aquí deberías guardar en DB, por ahora mando respuesta simulada
    res.status(201).json({
      message: "✅ Review creada correctamente",
      data: { comentario, rating, id_usuario },
    });
  } catch (error) {
    console.error("❌ Error al crear review:", error.message);
    res.status(500).json({ error: "Error al guardar review" });
  }
};

// Obtener reviews
const getReviews = async (req, res) => {
  try {
    // Simulación de datos
    res.json([
      { id: 1, comentario: "Muy bueno", rating: 5 },
      { id: 2, comentario: "Regular", rating: 3 },
    ]);
  } catch (error) {
    console.error("❌ Error al obtener reviews:", error.message);
    res.status(500).json({ error: "Error al obtener reviews" });
  }
};

// Eliminar un review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    // Aquí borrarías en DB, por ahora devuelvo confirmación
    res.json({ message: `✅ Review con id ${id} eliminada` });
  } catch (error) {
    console.error("❌ Error al eliminar review:", error.message);
    res.status(500).json({ error: "Error al eliminar review" });
  }
};

module.exports = {
  createReview,
  getReviews,
  deleteReview,
};
