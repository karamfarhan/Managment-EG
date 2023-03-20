const express = require("express");
const { protectedRoutes } = require("../controllers/authController");
const {
  createEmployee,
  getAllEmployees,
  getEmployee,
  deleteEmployee,
  updateEmployee,
  employeesName,
  drivers,
} = require("../controllers/employeesController");

const router = express.Router();

router
  .route("/select-employee")
  .get(protectedRoutes, employeesName, getAllEmployees);
router.route("/select-driver").get(protectedRoutes, drivers, getAllEmployees);

router.route("/").post(protectedRoutes, createEmployee).get(protectedRoutes, getAllEmployees);
router
  .route("/:id")
  .get(protectedRoutes, getEmployee)
  .delete(protectedRoutes,deleteEmployee)
  .patch(protectedRoutes,updateEmployee);

module.exports = router;
