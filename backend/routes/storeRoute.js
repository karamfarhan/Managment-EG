const express = require("express");
const {
  protectedRoutes,
  authorizationRoles,
} = require("../controllers/authController");
const {
  createInvoice,
  checkStoreId,
} = require("../controllers/invoiceController");
const {
  getStores,
  createStore,
  getStoresById,
  deleteStore,
  updateStore,
  storeName,
} = require("../controllers/storeController");

const router = express.Router();

router.route("/select-store").get(protectedRoutes, storeName, getStores);
router
  .route("/")
  .get(protectedRoutes, getStores)
  .post(protectedRoutes, createStore);
router
  .route("/:id")
  .get(protectedRoutes, getStoresById)
  .delete(protectedRoutes, authorizationRoles("admin"), deleteStore)
  .patch(protectedRoutes, updateStore);
router.route("/:id/invoice").post(protectedRoutes, checkStoreId, createInvoice);
//router.route("/invoice/:id").get(getInvoice);
module.exports = router;
