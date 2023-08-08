const express = require("express");
const dbconnect = require("./config/db");
dbconnect();
const moment = require('moment');
const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './view');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { createUser, createTask, UserTemplate, taskTemplate, LoginTemplate } = require("./Routes/index")

app.use("/user", createUser.route);
app.use("/task", createTask.route);
app.use("/usertemp", UserTemplate.route);
app.use("/tasktemp", taskTemplate.route)
app.use("/login", LoginTemplate.route)


require('dotenv').config();
const dotenv = require('dotenv');
dotenv.config();

app.listen(5000, () => {
    console.log(`Server started at ${process.env.PORT}`);
})