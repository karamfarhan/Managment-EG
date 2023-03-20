const Car = require("../models/carModel");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appErrors");
const CarActivity = require("../models/carActivityModel");

//create car
exports.createCar = catchAsync(async (req, res, next) => {
  const car = await Car.create(req.body);
  const populatedCar = await Car.findById(car._id).populate("driver", "name");
  res.status(201).json({
    message: "Car created successfully",
    data: {
      ...populatedCar._doc,
      driver: populatedCar.driver,
    },
  });
});
//get all cars
exports.getAllCars = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Car.find(), req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate();
  const cars = await features.query;
  const populatedCars = await Car.populate(cars, {
    path: "driver",
    select: "name",
  });
  const modifiedCars = populatedCars.map((car) => ({
    ...car.toObject(),
    driver: car.driver,
  }));
  res.status(200).json({
    count: modifiedCars.length,
    results: modifiedCars,
  });
});

//get car by ID
exports.getCarById = catchAsync(async (req, res, next) => {
  const car = await Car.findById(req.params.id)
    .populate("driver", "name")
    .select("-__v");
  const carActivity = await CarActivity.find({ car_id: req.params.id });
  if (!car) {
    return next(new AppError("No such car with that id", 404));
  }

  console.log(carActivity);
  res.status(200).json({
    message: "Car Found",
    data: {
      car,
      carActivity,
    },
  });
});
//get car by id and delete
exports.deleteCarById = catchAsync(async (req, res, next) => {
  const car = await Car.findByIdAndRemove(req.params.id);
  if (!car) {
    return next(new AppError("No such car with that id", 404));
  }
  res.status(204).json({
    message: "Successfully deleted car",
    data: null,
  });
});
//get car by id and update
exports.updateCar = catchAsync(async (req, res, next) => {
  const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //to return the new updated document
    runValidators: true, //apply schema validation
  });

  if (!car) {
    return next(new AppError("No such car with that id", 404));
  }

  const populatedCar = await Car.findById(car._id).populate("driver", "name");

  res.status(200).json({
    message: "SUCCESS",
    results: {
      ...populatedCar._doc,
      driver: populatedCar.driver,
    },
  });
});
