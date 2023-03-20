const Instrument = require("../models/instrumentsModel");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
//create a new instance
exports.createInstruments = catchAsync(async (req, res, next) => {
  const instruments = await Instrument.create(req.body);

  res.status(201).json({
    message: "instruments created",
    data: {
      instruments,
    },
  });
});

//get all the Instrumentss
exports.getAllInstruments = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Instruments.find(), req.query);

  const Instruments = await features.query;

  res.status(200).json({
    message: "success",
    count: Instruments.length,
    data: {
      Instruments,
    },
  });
});

// get Instruments
exports.deleteInstruments = catchAsync(async (req, res, next) => {
  const Instruments = await Instruments.findByIdAndRemove(req.params.id);
  if (!Instruments) {
    return next(new Error("Instruments is not found", 404));
  }
  res.status(204).json({
    message: "successfully removed",
    data: null,
  });
});

//update Instruments
exports.updateInstruments = catchAsync(async (req, res, next) => {
  const Instruments = await Instruments.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true, //apply schema validation
    }
  );
  if (!Instruments) {
    return next(new Error("Instruments is not found", 404));
  }
  res.status(204).json({
    message: "successfully removed",
    data: null,
  });
});
