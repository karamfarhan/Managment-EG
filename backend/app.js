const express = require("express");
const morgan = require("morgan");
const employeeRoute = require("./routes/employeesRoute");
const storeRoute = require("./routes/storeRoute");
const carRoute = require("./routes/carRoute");
const invoiceRoute = require("./routes/invoiceRoute");
const substanceRoute = require("./routes/substanceRoute");
const instrumentRoute = require("./routes/instrumentRoute");
const userRoute = require("./routes/userRoute");
const handleErrors = require("./controllers/errorController");
const AppError = require("./utils/appErrors");
const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.static(`${__dirname}/public`));

app.use(express.json());

app.use(morgan("tiny"));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//mounting
app.use("/api/v1/employees", employeeRoute);
app.use("/api/v1/stores", storeRoute);
app.use("/api/v1/cars", carRoute);
app.use("/api/v1/invoices", invoiceRoute);
app.use("/api/v1/substance", substanceRoute);
app.use("/api/v1/instrument", instrumentRoute);
app.use("/api/v1/users", userRoute);
//uncached routes
app.all("*", (req, res, next) => {
  const err = new AppError(`The Route ${req.originalUrl} is not defined`, 404);

  next(err);
});

app.use(handleErrors);
module.exports = app;
