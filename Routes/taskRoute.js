const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const router = express.Router();
const multer = require("multer")
const { auth } = require("../middleware/auth")
const validate = require("../middleware/validate")
const { CreateTaskValidation, priorityCheck } = require("../Validation/taskValidation")
const { createTask, GetTaskData, TaskdataPagination, EditTask, getTasksByPriorityPagination, EditTaskpost } = require("../Controller/taskController");

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
router
    .get("/form", (req, res) => {
        res.render('taskTemplate');
    })
    .post("/createtask", upload.single("image"), validate(CreateTaskValidation), createTask)
    .get("/getdata", auth(), GetTaskData)
    .get("/pagination", TaskdataPagination)
    .get("/edit-task/:id", EditTask)
    .post("/update/task/:id", EditTaskpost)
    .get("/paginate", getTasksByPriorityPagination)
module.exports = {
    route: router
}