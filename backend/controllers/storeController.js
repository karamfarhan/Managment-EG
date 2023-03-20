const jwt = require("jsonwebtoken");
const Store = require("../models/storeModel");
const AppError = require("../utils/appErrors");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const signToken = require("./authController");
const User = require("../models/userModel");
//store name
exports.storeName = (req, res, next) => {
  req.query.fields = "store_address";
  next();
};

//create a store
exports.createStore = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findOne({ _id: decoded.id });

  const store = await Store.create({
    ...req.body,
    created_by: user._id, // Set the created_by field to the user ID
  });

  // Use populate() to replace the created_by field with the user object
  await store.populate("created_by", "name");
  // Extract the name field from the populated user object
  const { name } = store.created_by;

  res.status(201).json({
    message: "Success",
    data: {
      store: { ...store.toObject(), created_by: name }, // Replace the created_by field with the name
    },
  });
});

//get stores
exports.getStores = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Store.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const stores = await features.query;
  res.status(200).json({
    message: "Success",
    data: {
      stores,
    },
  });
});

//get specific store
exports.getStoresById = catchAsync(async (req, res, next) => {
  const store = await Store.findById(req.params.id);
  // const selectedInvoice = invoice.filter((el) => el.store_id === req.params.id);
  if (!store) {
    return next(new AppError("store not found", 404));
  }

  res.status(200).json({
    message: "success",
    data: {
      store,
      invoice,
    },
  });
});

//delete store
exports.deleteStore = catchAsync(async (req, res, next) => {
  const store = await Store.findByIdAndDelete(req.params.id);

  if (!store) {
    return next(new AppError("store not found", 404));
  }

  res.status(204).json({
    message: "success",
    data: null,
  });
});

//update store
exports.updateStore = catchAsync(async (req, res, next) => {
  const store = await Store.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!store) {
    return next(new AppError("store not found", 404));
  }

  res.status(200).json({
    message: "success",
    data: {
      store,
    },
  });
});
