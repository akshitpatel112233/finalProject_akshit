const mongoose = require("mongoose");

const SlotSchmea = new mongoose.Schema({
  time: String,
  date: String,
  isAvailable: Boolean,
});

const Slot = mongoose.model("slot", SlotSchmea);

module.exports = Slot;
