const authentication = require("../middlewares/authentication");
const redirectIfAuthenticated = require("../middlewares/redirect-if-authenticated");
const roleBasedAccess = require("../middlewares/role-based-access");
const viewController = require("../controllers/view.controller");
const { ROLES } = require("../constants");

const viewRouter = require("express").Router();

viewRouter.get("/", viewController.dashboard);

viewRouter.get("/signup", redirectIfAuthenticated, viewController.signup);

viewRouter.get("/login", redirectIfAuthenticated, viewController.login);
viewRouter.get("/examiner", [authentication, roleBasedAccess(ROLES.EXAMINER)],viewController.examiner);


viewRouter.get(
  "/g",
  [authentication, roleBasedAccess(ROLES.DRIVER)],
  viewController.g
);

viewRouter.get(
  "/g2",
  [authentication, roleBasedAccess(ROLES.DRIVER)],
  viewController.g2
);

viewRouter.get(
  "/create-appointment-slots",
  [authentication, roleBasedAccess(ROLES.ADMIN)],
  viewController.createAppointmentSlots
);

module.exports = viewRouter;
