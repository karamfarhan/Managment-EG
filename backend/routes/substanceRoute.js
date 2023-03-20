const express = require("express");
const { protectedRoutes } = require("../controllers/authController");
const {
  createSubstances,
  getAllSubstances,
  deleteSubstance,
  updateSubstance,
  substanceName,
} = require("../controllers/substanceController");

const router = express.Router();

router.get(
  "/select-substance",
  protectedRoutes,
  substanceName,
  getAllSubstances
);
router
  .route("/")
  .post(protectedRoutes, createSubstances)
  .get(protectedRoutes, getAllSubstances);
router
  .route("/:id")
  .delete(protectedRoutes, deleteSubstance)
  .patch(protectedRoutes, updateSubstance);

module.exports = router;
