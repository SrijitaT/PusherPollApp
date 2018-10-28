const mongoose = require("mongoose");
const keys = require("./keys_dev");
const uri = keys.mongoURI;

mongoose
  .connect(
    uri,
    { useNewUrlParser: true }
  )
  .then(() => console.log("Mongodb connected"))
  .catch(err => console.log(err));
