const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const app = express();
const router = express.Router();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const { Userlogin } = require("../middleware/auth");


router.post('/user', Userlogin)

router.get('/user', (req, res) => {
    res.render('loginTemplate', { user: null })
});

module.exports = {
    route: router
};