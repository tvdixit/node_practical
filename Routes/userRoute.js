const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const router = express.Router();
const { auth, Userlogin } = require("../middleware/auth")
const validate = require("../middleware/validate")
const { createUser, GetUserData } = require("../Controller/userController");

const { CreateUserValidation, LoginValidation, idValidation } = require("../Validation/userValidation")
router
    .post("/createuser", validate(CreateUserValidation), createUser)
    .post("/login", validate(LoginValidation), Userlogin)
    .get("/getdata", auth(), validate(idValidation), GetUserData)

module.exports = {
    route: router
}