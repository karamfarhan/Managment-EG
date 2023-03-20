const { mongoose } = require("mongoose");
const AppError = require("../utils/appErrors");
const CarDestinationSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: [true, "the field is required"],
    },
    to: {
      type: String,
      required: [true, "the field is required"],
    },
  },
  { _id: false }
);

const CarActivitySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  destination: [CarDestinationSchema],
  car_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
    required: true,
  },
});
//validation
CarActivitySchema.pre("save", function (next) {
  if (this.destination.length === 0) {
    return next(new AppError("destination is required", 400));
  }
  next();
});
const CarActivity = new mongoose.model("CarActivity", CarActivitySchema);

module.exports = CarActivity;
