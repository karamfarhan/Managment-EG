const express = require("express");
const { protectedRoutes } = require("../controllers/authController");
const {
  createCarActivity,
  getCarActivity,
  checkCarId,
} = require("../controllers/carActivity");
const carController = require("../controllers/carController");
const router = express.Router();

router.route("/:id/car-activity").post(checkCarId, createCarActivity);

router
  .route("/")
  .post(protectedRoutes, carController.createCar)
  .get(protectedRoutes, carController.getAllCars);

router
  .route("/:id")
  .get(protectedRoutes,carController.getCarById)
  .delete(protectedRoutes, carController.deleteCarById)
  .patch(protectedRoutes, carController.updateCar);

module.exports = router;
