const express = require("express");
const { protectedRoutes } = require("../controllers/authController");
const {
  createInstruments,
  getAllInstruments,
  deleteInstruments,
  updateInstruments,
} = require("../controllers/instrumentsController");

const router = express.Router();

router.route("/").post(protectedRoutes, createInstruments).get(protectedRoutes, getAllInstruments);
router.route("/:id").delete(protectedRoutes, deleteInstruments).patch(protectedRoutes, updateInstruments);

module.exports = router;
