const Employee = require("../models/employeesModel");
const AppError = require("../utils/appErrors");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const Store = require("../models/storeModel");

//alias
exports.employeesName = (req, res, next) => {
  req.query.fields = "name";
  next();
};

//drivers
exports.drivers = (req, res, next) => {
  req.query.fields = "name job";
  req.query.category = "driver";
  next();
};

//get all employees
exports.getAllEmployees = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Employee.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const employees = await features.query;
  const populatedEmployees = await Employee.populate(employees, {
    path: "location", // make sure this references the 'location' field in the Employee model
    select: "store_address",
  });
  // // const modifiedEmployees = populatedEmployees.map((employee) => {
  // //   const location = employee.location.store_address;
  // //   if (location === null) {
  // //     // if store_address is null, don't include the location property
  // //     const { location, ...employeeWithoutLocation } = employee.toObject();
  // //     return employeeWithoutLocation;
  // //   } else {
  // //     return {
  // //       ...employee.toObject(),
  // //       location,
  // //     };
  // //   }
  // // });

  res.status(200).json({
    message: "SUCCESS",
    count: populatedEmployees.length,
    results: {
      employees: populatedEmployees,
    },
  });
});

//create employee
exports.createEmployee = catchAsync(async (req, res, next) => {
  const employee = await Employee.create(req.body);
  const populatedEmployee = await Employee.findById(employee._id).populate(
    "location",
    "store_address"
  );

  //validation for location
  const store = await Store.findById({ _id: req.body.location });

  if (store === null && req.body.location !== "")
    return next(new AppError("No store found", 400));

  if (
    store === null &&
    (req.body.location === null ||
      req.body.location === "" ||
      !req.body.location)
  ) {
    res.status(201).json({
      message: "succussfully created",
      results: {
        employee: populatedEmployee,
      },
    });
  }
});

//get a specific employee
exports.getEmployee = catchAsync(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    return next(new AppError("employee not found", 404));
  }
  res.status(200).json({
    message: "SUCCESS",
    results: {
      employee,
    },
  });
});
//delete a specific employee
exports.deleteEmployee = catchAsync(async (req, res, next) => {
  const deletedEmployee = await Employee.findByIdAndRemove(req.params.id);
  if (!deletedEmployee) {
    return next(new AppError(`there is no employee with that id`, 404));
  }
  res.status(204).json({
    message: "SUCCESS",
  });
});

//update a specific employee
exports.updateEmployee = catchAsync(async (req, res, next) => {
  const updatedEmployee = await Employee.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true, //to return the new updated document
      runValidators: true, //apply schema validation
    }
  );
  if (!updatedEmployee) {
    return next(new AppError(`there is no employee with that id`, 404));
  }

  const populatedEmployee = await Employee.findById(
    updatedEmployee._id
  ).populate("location", "store_address");

  res.status(200).json({
    message: "SUCCESS",
    results: {
      employee: populatedEmployee,
    },
  });
});
