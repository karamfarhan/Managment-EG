const Substance = require("../models/substancesModel");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");

//substance name
exports.substanceName = (req, res, next) => {
  req.query.fields = "name";
  console.log(req.body);

  next();
};

//create a new instance
exports.createSubstances = catchAsync(async (req, res, next) => {
  const substances = await Substance.create(req.body);
  substances.__v = undefined;
  res.status(201).json({
    message: "Substances created",
    data: {
      substances,
    },
  });
});

//get all the substances
exports.getAllSubstances = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Substance.find(), req.query)
    .limitFields()
    .sort()
    .paginate()
    .filter();

  const substances = await features.query;

  res.status(200).json({
    message: "success",
    count: substances.length,
    data: {
      substances,
    },
  });
});

// get substance
exports.deleteSubstance = catchAsync(async (req, res, next) => {
  const substance = await Substance.findByIdAndRemove(req.params.id);
  if (!substance) {
    return next(new Error("Substance is not found", 404));
  }
  res.status(204).json({
    message: "successfully removed",
    data: null,
  });
});

//update substance
exports.updateSubstance = catchAsync(async (req, res, next) => {
  const substance = await Substance.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true, //apply schema validation
  });
  if (!substance) {
    return next(new Error("Substance is not found", 404));
  }
  res.status(204).json({
    message: "successfully removed",
    data: null,
  });
});
