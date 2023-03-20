const dotenv = require("dotenv");

const mongoose = require("mongoose");
dotenv.config({ path: "./.env" });
const app = require("./app");

//mongoose server
const DB = process.env.DB.replace("<PASSWORD>", process.env.PASSWORD);
mongoose.connect(DB).then(() => console.log("Connected to Database:"));
//server
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(
    `Server listening on ${port}, docker and ${process.env.NODE_ENV} environment`
  );
});
