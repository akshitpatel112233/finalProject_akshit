const Slot = require("../model/Slot");
const { APPOINTMENT_SLOTS } = require("../constants");

const getSlotsByDate = async (req, res) => {
  if (!(req.query && req.query.date)) {
    return res.status(400).json({ error: "Invalid Requrest" });
  }
  const slots = await Slot.find({ date: req.query.date });
  res.json({ slots });
};

const createSlot = async (req, res) => {
  if (!req.body || !req.body.slot_date || !req.body.slot_time) {
    return res.render("create-slots", {
      title: "Create Appointment Slots",
      APPOINTMENT_SLOTS,
      message: "",
      error: "Invalid Request.",
    });
  }

  if (new Date() > new Date(req.body.slot_date)) {
    return res.render("create-slots", {
      title: "Create Appointment Slots",
      APPOINTMENT_SLOTS,
      message: "",
      error: "Slot date should be in future.",
    });
  }

  const alreadyCreated = await Slot.findOne({
    date: req.body.slot_date,
    time: req.body.slot_time,
  });

  if (alreadyCreated) {
    return res.render("create-slots", {
      title: "Create Appointment Slots",
      APPOINTMENT_SLOTS,
      message: "",
      error: "Duplicated slot can not be created.",
    });
  }

  const slot = new Slot({
    date: req.body.slot_date,
    time: req.body.slot_time,
    isAvailable: true,
  });

  await slot.save();

  return res.render("create-slots", {
    title: "Create Appointment Slots",
    APPOINTMENT_SLOTS,
    message: "Slot creted.",
    error: "",
  });
};





module.exports = { getSlotsByDate, createSlot };
