const express = require("express");
const router = express.Router();
const authVerifyMW = require("../middleware/AuthVerifyMW");
const AuthorizeVerifyMW = require("../middleware/AuthorizeMW");
const userRoleUpdate = require("../controller/userRoleUpdate");


router.patch("/updateRole/:userId", authVerifyMW, AuthorizeVerifyMW(["admin"]), userRoleUpdate);


module.exports = router