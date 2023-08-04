const express = require("express");
const dbconnect = require("./config/db");
dbconnect();
const app = express();
app.use(express.json());



const { createUser, createTask } = require("./Routes/index")

app.use("/user", createUser.route);
app.use("/task", createTask.route);




require('dotenv').config();
const dotenv = require('dotenv');
dotenv.config();

app.listen(5000, () => {
    console.log(`Server started at ${process.env.PORT}`);
})