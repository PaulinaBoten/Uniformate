// Crear un review
export const createReview = async (req, res) => {
  try {
    const { comentario, rating } = req.body;
    const id_usuario = req.user?.id || null;

    if (!comentario || !rating) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

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
export const getReviews = async (req, res) => {
  try {
    res.json([
      { id: 1, comentario: "Excelente servicio", rating: 5 },
      { id: 2, comentario: "Podría mejorar", rating: 3 },
    ]);
  } catch (error) {
    console.error("❌ Error al obtener reviews:", error.message);
    res.status(500).json({ error: "Error al obtener reviews" });
  }
};

// Eliminar review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    res.json({ message: `✅ Review con id ${id} eliminada` });
  } catch (error) {
    console.error("❌ Error al eliminar review:", error.message);
    res.status(500).json({ error: "Error al eliminar review" });
  }
};
