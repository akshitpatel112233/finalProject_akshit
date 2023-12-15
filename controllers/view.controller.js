const User = require("../model/User");
const formatDate = require("../utils/format-date");
const { APPOINTMENT_SLOTS } = require("../constants");
const Slot = require("../model/Slot");

exports.dashboard = (req, res) => {
  res.render("dashboard", { title: "Dashboard | DriveTest" });
};

exports.signup = (req, res) => {
  res.render("signup", { error: "", title: "Sign Up | DriveTest" });
};

exports.login = (req, res) => {
  let message = "";

  if (req.query.registration && req.query.registration === "1") {
    message = "Registered Succesfully. Login to continue.";
  }

  if (req.query.redirected && req.query.redirected === "1") {
    message = "Login to continue.";
  }

  res.render("login", { error: "", message, title: "Login | DriveTest" });
};

exports.g2 = async (req, res) => {
  const {
    session: { userId },
  } = req;

  const user = await User.findById(userId);

  const isFirstTime = user.licenseNumber === "";

  const emptyUserObj = {
    car_details: {},
  };

  if (isFirstTime) {
    return res.render("g2", {
      error: "",
      message: "",
      user: emptyUserObj,
      dobString: "",
      title: "G2 Test | DriveTest",
    });
  }

  const dobString = formatDate(user.dob);

  if (user.appointment_id) {
    const appointment = await Slot.findOne({
      _id: user.appointment_id,
    });

    if (appointment) {
      appointmentObject = appointment;
      let allSlots = await Slot.find({});
      appointmentSlots = allSlots
        .filter((slot) => slot.date === appointment.date)
        .map((slot) =>
          slot.time === appointment.time
            ? { ...slot._doc, selected: true }
            : { ...slot._doc }
        );
    } else {
      appointmentObject = null;
      appointmentSlots = [];
    }
  } else {
    appointmentObject = null;
    appointmentSlots = [];
  }

  return res.render("g2", {
    error: "",
    message: "",
    user,
    dobString,
    title: "G2 Test | DriveTest",
  });
};

exports.g = async (req, res) => {
  const {
    session: { userId },
  } = req;

  const user = await User.findById(userId);

  const isFirstTime = user.licenseNumber === "";

  if (isFirstTime) {
    return res.redirect("/g2");
  }

  const dobString = formatDate(user.dob);

  return res.render("g", {
    error: "",
    user,
    dobString,
    message: "",
    
    title: "G Test | DriveTest",
  });
};

exports.notFoundPage = (req, res) => {
  res.render("not-found", { title: "404 | DriveTest" });
};

exports.createAppointmentSlots = (req, res) => {
  res.render("create-slots", {
    title: "Create Appointment Slots",
    APPOINTMENT_SLOTS,
    message: "",
    error: "",
  });
};

exports.examiner = (req,res)=>{
  res.render("examiner",{
    title: "Examiner",
  })
}
