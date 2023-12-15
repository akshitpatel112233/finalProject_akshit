const mongoose = require("mongoose");

const mongoURL =
  "mongodb+srv://abp7901:akshit123@cluster0.gqmp5t6.mongodb.net/DriveTest?retryWrites=true&w=majority";
// "mongodb://localhost:27017/akshit_patel";

const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(mongoURL);
    console.log(`Database Connected : ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to database:", error.message);
    process.exit(1);
  }
};

module.exports = dbConnection;
