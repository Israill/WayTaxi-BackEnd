const Router = require("express");
const userController = require("../controllers/users.controller");
const router = Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware");
const { topUpWallet } = require("../controllers/users.controller");

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 16 }),
  userController.registatration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh);
router.get("/users", userController.getUser);
router.patch("/users/:id", userController.patchUser);
router.patch("/wallet/:id", userController.topUpWallet);

module.exports = router;
