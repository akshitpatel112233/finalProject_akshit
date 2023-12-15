const { ROLES } = require("../constants");
const slotController = require("../controllers/slot.controller");
const authentication = require("../middlewares/authentication");
const roleBasedAccess = require("../middlewares/role-based-access");

const slotRouter = require("express").Router();

slotRouter.get("/get-slots-by-date", slotController.getSlotsByDate);

slotRouter.post(
  "/create-slots",
  [ roleBasedAccess(ROLES.ADMIN)],
  slotController.createSlot
);

module.exports = slotRouter;
