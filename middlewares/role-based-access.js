module.exports = (role) => async (req, res, next) => {
  console.log(role)
  if (req.session.userType !== role) {
    return res.redirect("/");
  }

  next();
};
