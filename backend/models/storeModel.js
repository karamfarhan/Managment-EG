const mongoose = require("mongoose");
const Employee = require("./employeesModel");
const employeeModel = require("./employeesModel");
const storeSchema = new mongoose.Schema({
  store_name: {
    type: String,
    required: [true, "store name is required"],
    trim: true,
  },
  store_address: {
    type: String,
    required: [true, "store address is required"],
    trim: true,
  },
  note: String,
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
storeSchema.pre("findOneAndUpdate", async function (next) {
  const employees = await employeeModel.find({
    location: this._id,
  });
  next();
});

const Store = mongoose.model("Store", storeSchema);
module.exports = Store;
