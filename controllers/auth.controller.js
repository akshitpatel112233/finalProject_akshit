const User = require("../model/User");

const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    const { body: data } = req;

    if (!(data && data.username && data.password && data.user_type)) {
      return res.render("signup", {
        error: "All fields are Mandatory!",
        title: "Sign UP | DriveTest",
      });
    }

    const userExists = await User.findOne({ username: data.username });

    if (userExists) {
      return res.render("signup", {
        error: "Username already registered!",
        title: "Sign UP | DriveTest",
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = new User({ ...data, password: hashedPassword });

    await newUser.save();

    res.redirect("/login?registration=1");
  } catch (err) {
    return res.render("signup", {
      error:
        err instanceof Error
          ? err.message
          : "Something Went Wrong! Please try again.",
      title: "Sign UP | DriveTest",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { body: data } = req;

    if (!(data && data.username && data.password)) {
      return res.render("login", { error: "Enter username and password!" });
    }

    const user = await User.findOne({ username: data.username });

    if (!user) {
      return res.render("login", {
        error: "Invalid Username or Password",
        message: "",
        title: "Sign UP | DriveTest",
      });
    }

    userObject = user;
    const passwordMatches = await bcrypt.compare(data.password, user.password);
    if (!passwordMatches) {
      return res.render("login", {
        error: "Invalid Username or Password",
        message: "",
        title: "Sign UP | DriveTest",
      });
    }

    req.session.userId = user._id;
    req.session.userType = user.user_type;
    res.redirect("/");
  } catch {
    return res.render("login", {
      error: "Something went wrong! Please try again later.",
      message: "",
      title: "Sign UP | DriveTest",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
  } catch {}
};

const logout = async (req, res) => {
  await req.session.destroy();
  res.redirect("/");
};

const authController = { registerUser, loginUser, logout };

module.exports = authController;
