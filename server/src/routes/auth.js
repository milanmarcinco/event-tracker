const express = require("express");
const router = express.Router();

const {
  register,
  logIn,
  renewToken,
  changePassword,
  updateProfile,
  logOut,
  logOutAll,
  deleteProfile,
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", logIn);
router.post("/renew-token", renewToken);
router.patch("/change-password", changePassword);
router.put("/update-profile", updateProfile);
router.delete("/logout", logOut);
router.delete("/logout-all", logOutAll);
router.delete("/delete-profile", deleteProfile);

module.exports = router;
