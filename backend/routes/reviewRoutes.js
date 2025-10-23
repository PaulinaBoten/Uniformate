// backend/routes/reviewRoutes.js

import express from "express";
import {
  createReview,
  getReviews,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

// 📦 Crear un review
router.post("/", async (req, res, next) => {
  try {
    await createReview(req, res);
  } catch (error) {
    console.error("❌ Error al crear review:", error.message);
    next(error);
  }
});

// 📋 Obtener todos los reviews
router.get("/", async (req, res, next) => {
  try {
    await getReviews(req, res);
  } catch (error) {
    console.error("❌ Error al obtener reviews:", error.message);
    next(error);
  }
});

// 🗑 Eliminar un review
router.delete("/:id", async (req, res, next) => {
  try {
    await deleteReview(req, res);
  } catch (error) {
    console.error("❌ Error al eliminar review:", error.message);
    next(error);
  }
});

export default router;
