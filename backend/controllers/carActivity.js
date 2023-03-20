const CarActivity = require("../models/carActivityModel");
const Car = require("../models/carModel");
const AppError = require("../utils/appErrors");
const catchAsync = require("../utils/catchAsync");

//create the car activity
exports.createCarActivity = catchAsync(async (req, res, next) => {
  const activity = await CarActivity.create({
    date: req.body.date,
    destination: req.body.destination,
    car_id: req.params.id,
  }).select("-__v");

  res.status(201).json({
    message: "Car Activity created",
    data: {
      activity,
    },
  });
});
//get the car activity

//check car id
exports.checkCarId = catchAsync(async (req, res, next) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    return next(new AppError("no car found", 404));
  }
  next();
});
