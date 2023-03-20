const mongoose = require("mongoose");

const InstrumentItemsSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "instrument name is required"],
  },
  last_maintainace: {
    type: Date,
  },
  place_of_maintainer: {
    type: String,
    trim: true,
  },
  note: String,
});

const InstrumentSchema = new mongoose.Schema({
  instruments: [InstrumentItemsSchema],
});

//validation
InstrumentSchema.pre("save", function (next) {
  if (this.instruments.length === 0) {
    return next(new AppError("please specify at least one instrument", 400));
  }

  next();
});

const Instrument = mongoose.model("Instrument", InstrumentSchema);

module.exports = Instrument;
