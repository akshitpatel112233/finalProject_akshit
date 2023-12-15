const authController = require("../controllers/auth.controller");

const authRouter = require("express").Router();

authRouter.post("/login", authController.loginUser);
authRouter.get("/logout", authController.logout);
authRouter.post("/signup", authController.registerUser);

module.exports = authRouter;
