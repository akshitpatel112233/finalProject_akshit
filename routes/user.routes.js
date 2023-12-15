const userRouter = require("express").Router();
const authenticated = require("../middlewares/authentication");
const userController = require("../controllers/user.controller");

userRouter.post("/g2", userController.updateData);
userRouter.post("/timeBookG", userController.updateDataForGDriver);
userRouter.get("/getExamData", userController.getExamData);
userRouter.post("/getUserDetailsForExam/:id",userController.updateUserExamInfo)
userRouter.post("/result/:id",userController.updateResult)
userRouter.get("/getUserExamResults", userController.getExamResult);
userRouter.get("/getExamResultForUser", userController.getExamResultForUser);


module.exports = userRouter;
