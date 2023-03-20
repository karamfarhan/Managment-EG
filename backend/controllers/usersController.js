const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
//get all users

exports.getUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .sort()
    .filter()
    .limitFields()
    .paginate();
  const users = await features.query;

  res.status(200).json({
    message: "Success",
    data: {
      users,
    },
  });
});
