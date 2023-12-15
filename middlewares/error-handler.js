module.exports = (error, req, res, next) => {
  res.render("error", { title: "500 | DriveTest", error: error.message || "" });
  next();
};
