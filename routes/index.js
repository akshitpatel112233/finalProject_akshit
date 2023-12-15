const authRouter = require("./auth.routes");
const userRouter = require("./user.routes");
const viewRouter = require("./view.routes");
const slotRouter = require("./slot.routes");
const { notFoundPage } = require("../controllers/view.controller");

const mainRouter = require("express").Router();

mainRouter.use(viewRouter);
mainRouter.use(authRouter);
mainRouter.use(userRouter);
mainRouter.use(slotRouter);

mainRouter.use("*", notFoundPage);

module.exports = mainRouter;
