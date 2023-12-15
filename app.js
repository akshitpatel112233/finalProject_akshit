const express = require("express");
const expressSession = require("express-session");
const expressEjsLayouts = require("express-ejs-layouts");

const dbConnection = require("./utils/dbConnection");
const router = require("./routes");
const errorHandler = require("./middlewares/error-handler");

const app = express();

const port = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(expressEjsLayouts);

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  expressSession({
    secret: "0nPh0YjpRQ24Ifo7SHxiAvr/KTk0dArKFmEHW0By/Uk=",
    resave: false,
    saveUninitialized: true,
  })
);

global.loggedIn = null;
global.userType = null;
global.userObject = null;
global.appointmentObject = null;
global.appointmentSlots = [];

app.use("*", (req, res, next) => {
  loggedIn = req.session.userId;
  userType = req.session.userType;
  next();
});

app.use(router);

app.use(errorHandler);

dbConnection().then(() => {
  app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
  });
});
