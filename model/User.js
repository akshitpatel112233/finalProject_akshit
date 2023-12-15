const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  user_type: {
    type: String,
    required: true,
    // allowed values
    enum: ["driver", "examiner", "admin"],
  },
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  licenseNumber: { type: String, default: "" },
  age: { type: Number, default: 0 },
  dob: { type: Date },
  car_details: {
    make: { type: String, default: "" },
    model: { type: String, default: "" },
    year: { type: String, default: "" },
    plateNumber: { type: String, default: "" },
  },
  appointment_id: String,
  testType:String,
  comment:String,
  testResult:String,
});

const User = mongoose.model("user", userSchema);

module.exports = User;
