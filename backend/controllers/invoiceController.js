const Employee = require("../models/employeesModel");
const Invoice = require("../models/invoiceModel");
const Store = require("../models/storeModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appErrors");
const catchAsync = require("../utils/catchAsync");

//create Invoice
exports.createInvoice = catchAsync(async (req, res, next) => {
  const invoice = await Invoice.create({
    substance: req.body.substance,
    instrument: req.body.instrument,
    store_id: req.params.id,
  });
  const populatedInvoice = await Invoice.findById(invoice._id)
    .populate({
      path: "substance.substanceId",
      select: "name -_id",
    })
    .lean();

  populatedInvoice.substance = populatedInvoice.substance.map((item) => {
    item.substanceId = item.substanceId.name; // extract name value from nested object
    return item;
  });
  res.status(201).json({
    message: "Invoice created successfully",
    data: {
      invoice: populatedInvoice,
    },
  });
});

//get all Invoices
exports.getAllInvoices = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Invoice.find(), req.query)
    .limitFields()
    .paginate()
    .sort()
    .filter();
  const invoices = await features.query;

  res.status(200).json({
    message: "Invoices fetched successfully",
    count: invoices.length,
    data: {
      invoices,
    },
  });
});

//get single Invoice
exports.getInvoice = catchAsync(async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id).select("-__v");

  if (!invoice) {
    return next(new AppError("No invoice with that id exists", 404));
  }
  const store = await Store.findById(invoice.store_id);

  if (!store) {
    return res.status(200).json({
      message: "Invoice fetched successfully",
      data: {
        invoice,
      },
    });
  }
  const storeName = store.toObject().store_name;
  res.status(200).json({
    message: "Invoice fetched successfully",
    store: storeName,
    data: {
      invoice,
    },
  });
});
//delete single Invoice
exports.deleteInvoice = catchAsync(async (req, res, next) => {
  const invoice = await Invoice.findByIdAndDelete(req.params.id);

  if (!invoice) {
    return next(new AppError("No invoice with that id exists", 404));
  }
  res.status(204).json({
    message: "Invoice deleted successfully",
    data: null,
  });
});
// update single Invoice
exports.updateInvoice = catchAsync(async (req, res, next) => {
  const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!invoice) {
    return next(new AppError("No invoice with that id exists", 404));
  }

  res.status(200).json({
    message: "Invoice updated successfully",
    data: {
      invoice,
    },
  });
});

async function deleteAllInvoice() {
  await Employee.deleteMany({});
}
//deleteAllInvoice();

//check the quantity

//check store id
exports.checkStoreId = catchAsync(async (req, res, next) => {
  const store = await Store.findById(req.params.id);
  if (store === null) {
    return next(new AppError("there is no store with that id", 404));
  }
  next();
});
