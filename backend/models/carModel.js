const mongoose = require("mongoose");

const CarModel = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: [true, "driver name is required"],
  },
  car_model: {
    type: String,
    trim: true,
    required: [true, "car model is required"],
  },
  car_type: {
    type: String,
    trim: true,
    required: [true, "car type is required"],
  },
  car_number: {
    type: String,
    trim: true,
    required: [true, "car number is required"],
  },
  counter: {
    type: String,
    trim: true,
    required: [true, "counter is required"],
  },
});

const Car = mongoose.model("Car", CarModel);
module.exports = Car;
