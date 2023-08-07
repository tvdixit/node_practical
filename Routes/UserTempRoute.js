const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const app = express();
const router = express.Router();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const { createUser } = require("../Controller/userController")


router.get("/form", (req, res) => {
    res.render('userTemplate');
})

router.post("/createuser", createUser)


module.exports = {
    route: router
};