const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const router = express.Router();
const multer = require("multer")
const { v4: uuidv4 } = require('uuid');
const { auth } = require("../middleware/auth")
const validate = require("../middleware/validate")
const { CreateTaskValidation, idValidation, taskidValidation, prioritySchema } = require("../Validation/taskValidation")
const { createTask, GetTaskData, TaskbyDESC, TaskdataPagination, deleteTaskData, updatetask, deletetask, deletedtask, taskpriority } = require("../Controller/taskController");


const profileUpload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'upload/image')
        },
        filename: (req, file, cb) => {
            const fileExtName = file.originalname.substring(file.originalname.lastIndexOf('.'));
            const fileName = `${uuidv4()}${fileExtName}`;
            console.log(fileName);
            cb(null, fileName);
        }
    })
}).array('image', 5);
router
    .post("/createtask", profileUpload, validate(CreateTaskValidation), createTask)

    .get("/getdata", auth(), GetTaskData)

    .get("/prioritytask", TaskbyDESC)

    .get("/pagination", TaskdataPagination)

    .delete("/delete", auth(), validate(idValidation), deleteTaskData)

    .patch("/update", auth(), validate(taskidValidation), updatetask)

    .patch("/delete/status", auth(), validate(taskidValidation), deletetask)

    .get("/deleted", deletedtask)

    .get("/", validate(prioritySchema), taskpriority)
module.exports = {
    route: router
}