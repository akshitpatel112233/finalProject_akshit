const bcrypt = require("bcrypt");
const User = require("../model/User");
const formatDate = require("../utils/format-date");
const Slot = require("../model/Slot");
const { use } = require("bcrypt/promises");

const isValidString = (value) => value && value.length > 0;
const isValidLicenseNumber = (licenseNumber) =>
  licenseNumber && licenseNumber.length === 8;

function getAge(dateString) {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const isValidDate = function (date) {
  return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
};

const updateData = async (req, res) => {
  try {
    const { body: data } = req;

    const emptyUserObj = {
      car_details: {},
    };

    const existingData = await User.findById(req.session.userId);

    const isFirstTime =
      existingData.licenseNumber === "" || existingData.age === 0;

    let dobString = isFirstTime ? "" : formatDate(existingData.dob);

    const {
      firstName,
      lastName,
      licenseNumber,
      dob,
      make,
      model,
      year,
      plateNumber,
    } = data;

    if (!isValidString(firstName) || !isValidString(lastName)) {
      return res.render("g2", {
        error: "Enter valid name.",
        message: "",
        title: "G2 Test | DriveTest",
        user: isFirstTime ? emptyUserObj : existingData,
        dobString,
      });
    }

    if (isFirstTime && !isValidLicenseNumber(licenseNumber)) {
      return res.render("g2", {
        error: "Enter valid Liscense number.",
        message: "",
        title: "G2 Test | DriveTest",
        user: isFirstTime ? emptyUserObj : existingData,
        dobString,
      });
    }

    if (!isValidDate(dob)) {
      return res.render("g2", {
        error: "Enter valid Date of birth.",
        message: "",
        title: "G2 Test | DriveTest",
        user: isFirstTime ? emptyUserObj : existingData,
        dobString,
      });
    }

    if (getAge(dob) <= 16) {
      return res.render("g2", {
        error: "Minimum age requierd is 16.",
        message: "",
        title: "G2 Test | DriveTest",
        user: isFirstTime ? emptyUserObj : existingData,
        dobString,
      });
    }

    if (
      !(
        isValidString(make) &&
        isValidString(model) &&
        isValidString(plateNumber) &&
        year &&
        year >= 1800 &&
        year <= new Date().getFullYear()
      )
    ) {
      return res.render("g2", {
        error: "Enter valid car details.",
        message: "",
        title: "G2 Test | DriveTest",
        user: isFirstTime ? emptyUserObj : existingData,
        dobString,
      });
    }

    let dataToInsert = {
      firstName,
      lastName,
      dob,
      age: getAge(dob),
      car_details: {
        make,
        model,
        year,
        plateNumber,
      },
    };

    if (existingData.appointment_id !== data.appointment_id) {
      if (existingData.appointment_id) {
        await Slot.updateOne(
          { _id: existingData.appointment_id },
          { isAvailable: true }
        );
      }

      if (data.appointment_id) {
        const getAppointment = await Slot.findOne({
          _id: data.appointment_id,
        });

        console.log({ getAppointment });

        if (!getAppointment.isAvailable) {
          return res.render("g2", {
            error: "Selected slot is not empty.",
            message: "",
            title: "G2 Test | DriveTest",
            user: isFirstTime ? emptyUserObj : existingData,
            dobString,
          });
        }

        await Slot.updateOne(
          { _id: data.appointment_id },
          { isAvailable: false }
        );

        dataToInsert.appointment_id = getAppointment._id;
        dataToInsert.testType = "G2"

        const appointment = await Slot.findOne({
          _id: data.appointment_id,
        });

        if (appointment) {
          appointmentObject = appointment;
          let allSlots = await Slot.find({});
          appointmentSlots = allSlots
            .filter((slot) => slot.date === appointment.date)
            .map((slot) =>
              slot.time === appointment.time
                ? { ...slot._doc, isAvailable: true, selected: true }
                : slot
            );
        }
      } else {
        appointmentObject = null;
        appointmentSlots = [];
      }
    }

    if (isFirstTime) {
      const encryptedLicenseNumber = await bcrypt.hash(licenseNumber, 10);

      dataToInsert = {
        ...dataToInsert,
        licenseNumber: encryptedLicenseNumber,
      };
    }
    dataToInsert.testType = "G2"


    await User.updateOne({ _id: req.session.userId }, dataToInsert);

    const updateRes = await User.findOne({ _id: req.session.userId });

    console.log(updateRes);

    dobString = formatDate(updateRes.dob);

    res.render("g2", {
      error: "",
      message: "Data updated successfully.",
      user: updateRes,
      dobString,
      title: "G2 Test | DriveTest",
    });
  } catch (err) {
    console.log("updateData error", err);
    return res.render("g2", {
      error: "Something went wrong! Please try again.",
      message: "",
      title: "G2 Test | DriveTest",
      user: isFirstTime ? emptyUserObj : existingData,
      dobString: "",
    });
  }
};


const updateDataForGDriver = async (req, res) => {
  try {
    const { body: data } = req;
    let updateNewData={};

    const existingData = await User.findById(req.session.userId);

 
    
    if (existingData.appointment_id !== data.appointment_id) {
      if (existingData.appointment_id) {
        await Slot.updateOne(
          { _id: existingData.appointment_id },
          { isAvailable: true }
        );
      }

      if (data.appointment_id) {
        const getAppointment = await Slot.findOne({
          _id: data.appointment_id,
        });

        const dobString = formatDate(existingData.dob);

        if (!getAppointment.isAvailable) {
          return res.render("g", {
            error: "Selected slot is not empty.",
            message: "",
            dobString,
            updateRes,
            title: "G Test | DriveTest",
          });
        }

        await Slot.updateOne(
          { _id: data.appointment_id },
          { isAvailable: false }
        );
 

        updateNewData = { appointment_id: getAppointment._id,testType:"G" };

        const appointment = await Slot.findOne({
          _id: data.appointment_id,
        });

        if (appointment) {
          appointmentObject = appointment;
          let allSlots = await Slot.find({});
          appointmentSlots = allSlots
            .filter((slot) => slot.date === appointment.date)
            .map((slot) =>
              slot.time === appointment.time
                ? { ...slot._doc, isAvailable: true, selected: true }
                : slot
            );
        }
      } else {
        appointmentObject = null;
        appointmentSlots = [];
      }
    }

    updateNewData = { testType:"G" };

    await User.updateOne({ _id: req.session.userId }, updateNewData);

    const updateRes = await User.findOne({ _id: req.session.userId });
    console.log(updateRes)


  

  
    const dobString = formatDate(updateRes.dob);

     res.render("g", {
      message: "Appointment selected",
      title: "G Test | DriveTest",
      dobString,
      updateRes,
      error: "",
    });  } catch (err) {
    console.log("updateData error", err);
    return res.redirect("/g")
  }
};


const getExamData = async (req, res) => {
  try {
    console.log(req.query.testType)
    let query = { 
      appointment_id: { $ne: null, $exists: true }, 
      ...(req.query.testType && { testType: req.query.testType })
    };

    const users = await User.find(query).lean();
    console.log(users);

  

    const appointmentIds = users.map(user => user.appointment_id);
    const appointments = await Slot.find({ _id: { $in: appointmentIds }});

    let userData = users.map(user => ({
      userId: user._id,
      firstName: user.firstName,
      testType: user.testType,
      appointmentDetails: appointments.find(appointment => appointment._id.toString() === user.appointment_id) || {},
    }));

    res.json(userData);
  } catch (error) {
    console.error('Error in /getExamData:', error);
    res.status(500).send('Internal Server Error');
  }
};


const updateUserExamInfo =  async (req, res) => {

  const getData = await User.findOne({ _id: req.params.id });
  console.log(getData)
  const appointmentData = await Slot.findOne({
    _id: getData.appointment_id,
  });

  const userData = {
    user: getData,
    appointment: appointmentData,
  };
  console.log(userData)

   res.render("userExamDetails", {
   
    data: userData,
    title: "User Details For Exam",
  });
}
const updateResult = async(req,res)=>{

  const data = {testResult:req.body.result ,comment: req.body.comment,};
  await User.findByIdAndUpdate({ _id: req.params.id }, data);
  return res.redirect("/examiner");
}

const getExamResult = async(req,res)=>{
  let query = { testResult: { $ne: null } };
  let  getExamResultData = await User.find(query);
  console.log(getExamResultData)
  res.json(getExamResultData)
}
const getExamResultForUser = async (req, res) => {
  try {
    let query = { _id: req.session.userId, testResult: { $ne: null } };
    let getExamResultData = await User.find(query);

    if (getExamResultData.length > 0 && getExamResultData[0].testType === 'G2') {
      return res.json(getExamResultData); 
    }

    res.json(null); 
  } catch (error) {
    console.error('Error in getExamResultForUser:', error);
    res.status(500).send('Internal Server Error');
  }
};

const getExamResultForUserG = async (req, res) => {
  try {
    let query = { _id: req.session.userId, testResult: { $ne: null } };
    let getExamResultData = await User.find(query);
  

    if (getExamResultData.length > 0 && getExamResultData[0].testType === 'G') {
      return res.json(getExamResultData);
    }

    res.json(null); 
  } catch (error) {
    console.error('Error in getExamResultForUserG:', error);
    res.status(500).send('Internal Server Error');
  }
};



module.exports = { updateData,updateDataForGDriver,getExamData,updateUserExamInfo,updateResult,getExamResult,getExamResultForUser,getExamResultForUserG };
