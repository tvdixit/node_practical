const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth")
const validate = require("../middleware/validate")
const { createUser, GetUserData, Userlogin } = require("../Controller/userController");
const { CreateUserValidation, LoginValidation, idValidation } = require("../Validation/userValidation")

router
    .get("/form", (req, res) => {
        res.render('userTemplate');
    })
    .post("/createuser", validate(CreateUserValidation), createUser)
    .get('/login', (req, res) => {
        res.render('loginTemplate', { user: null })
    })
    .post("/userlogin", validate(LoginValidation), Userlogin)
    .get("/getdata", auth(), validate(idValidation), GetUserData)
module.exports = {
    route: router
}