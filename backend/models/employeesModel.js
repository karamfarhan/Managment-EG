const mongoose = require("mongoose");

const employeeModel = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Employee name is required"],
    trim: true,
  },
  job: {
    type: String,
    trim: true,
    required: [true, "Please insert a job"],
  },
  category: {
    type: String,
    enum: ["driver", "engineer", "purchase", "accountant"],
    required: [true, "Please insert a category for employee"],
  },
  dateOfWork: {
    type: Date,
  },
  insurance: {
    type: Boolean,
    required: [true, "insurance is required"],
  },
  experience: {
    type: Number,
    default: 1,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    default: null,
  },
});

const Employee = mongoose.model("Employee", employeeModel);

module.exports = Employee;
