const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/appErrors");
const catchAsync = require("../utils/catchAsync");

const signToken = function (id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRE,
  });
};

//sign up
exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    confirmedPassword: req.body.confirmedPassword,
  });
  user.password = undefined;
  user.__v = undefined;
  const token = signToken(user._id);
  res.status(201).json({
    message: "Your account has been created",
    token,
    data: {
      user,
    },
  });
});

//login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) email and password are exits

  if (!email || !password) {
    return next(new AppError("please write the correct email and password"));
  }

  //2) check if the user exists && pasowrd is correct

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.validatePassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  //3) if everything is ok then send back the token to the user

  const token = signToken(user._id);
  res.status(200).json({
    message: "Successfully logged in",
    token,
  });
});

//protect routes
exports.protectedRoutes = catchAsync(async (req, res, next) => {
  let token;

  //1) Getting token and check if it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("you are not authorized", 401));
  }

  //2) verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //3) check if the user exists

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new AppError("the user belonging to this token is no longer exits", 401)
    );
  }

  //GRANT ACCESS TO PROTECTED ROUTE
  req.user = user;

  next();
});

//roles
exports.authorizationRoles = function (...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("you don't have premission to do that action", 403)
      );
    }

    next();
  };
};
