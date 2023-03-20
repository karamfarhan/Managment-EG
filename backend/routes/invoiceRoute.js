const express = require("express");
const { protectedRoutes } = require("../controllers/authController");
const {
  getInvoice,
  deleteInvoice,
  updateInvoice,
  getAllInvoices,
} = require("../controllers/invoiceController");

const router = express.Router();
router.route("/").get(protectedRoutes, getAllInvoices);
router
  .route("/:id")
  .get(protectedRoutes, getInvoice)
  .delete(protectedRoutes, deleteInvoice)
  .patch(protectedRoutes, updateInvoice);

module.exports = router;
