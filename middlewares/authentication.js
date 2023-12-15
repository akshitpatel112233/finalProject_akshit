const User = require("../model/User");

module.exports = async (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login?redirected=1");
  }

  const user = await User.findById(req.session.userId);
  if (!user) {
    return res.redirect("/login?redirected=1");
  }

  next();
};
