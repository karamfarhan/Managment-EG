const mongoose = require("mongoose");
const AppError = require("../utils/appErrors");

const SubstanceSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "substance name is required"],
  },
  quantity: {
    type: Number,
    required: [true, "quantity is required"],
  },
  unit_type: {
    type: String,
    trim: true,
    required: [true, "unit type is required"],
  },
  note: String,
});

// SubstanceSchema.pre("save", function (next) {
//   if (this.substances.length === 0) {
//     return next(new AppError("please specify at least one substitution", 400));
//   }

//   next();
// });

const Substance = mongoose.model("Substance", SubstanceSchema);

module.exports = Substance;
