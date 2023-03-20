const mongoose = require("mongoose");
const AppError = require("../utils/appErrors");
const Substance = require("./substancesModel");

const InstrumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "instrument name is required"],
  },
  note: String,
});

const InvoiceSchema = new mongoose.Schema({
  substance: [
    {
      substanceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Substance",
        required: [true, "substance is required"],
      },
      quantity: {
        type: Number,
        required: [true, "quantity is required"],
        validate: {
          validator: async function (value) {
            const substance = await Substance.findById(this.substanceId);
            if (!substance) {
              return false;
            }
            const newQuantity = substance.quantity - value;
            if (newQuantity < 0) {
              return false;
            }
            await Substance.findByIdAndUpdate(
              this.substanceId,
              { quantity: newQuantity },
              {
                new: true, // to return the new updated document
                runValidators: true, // apply schema validation
              }
            ).exec();
            return substance.quantity >= value;
          },
          message: "You dont't have enough resources in your main store.",
        },
      },
    },
  ],
  instrument: [InstrumentSchema],
  store_id: {
    type: String,
    required: true,
    // select: false,
  },
  note: String,
});

InvoiceSchema.pre("save", function (next) {
  if (this.substance.length === 0 && this.instrument.length === 0) {
    return next(
      new AppError("at least substance or instruments is required", 400)
    );
  }

  next();
});

// InvoiceSchema.pre("save", asyn   c function (req, res, next) {
//   // const store = await Store.findById(req.params._id);
//   console.log(req.params);
//   next();
// });

const Invoice = mongoose.model("Invoice", InvoiceSchema);

module.exports = Invoice;
