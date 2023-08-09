const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const router = express.Router();
const multer = require("multer")
// const { v4: uuidv4 } = require('uuid');
const { auth } = require("../middleware/auth")
const validate = require("../middleware/validate")
const { CreateTaskValidation, idValidation, taskidValidation, priorityCheck } = require("../Validation/taskValidation")
const { createTask, GetTaskData, TaskdataPagination, deletedtask, taskpriority, getAllTasks, EditTask, getTasksByPriorityPagination, EditTaskpost } = require("../Controller/taskController");


// const profileUpload = multer({
//     storage: multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null, 'upload/image')
//         },
//         filename: (req, file, cb) => {
//             const fileExtName = file.originalname.substring(file.originalname.lastIndexOf('.'));
//             const fileName = `${uuidv4()}${fileExtName}`;
//             console.log(fileName);
//             cb(null, fileName);
//         }
//     })
// }).array('image', 5);
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
    .post("/createtask", upload.single("image"), createTask)
    .get("/getdata", auth(), GetTaskData)
    .get("/pagination", TaskdataPagination)

    .get("/update-task/:id", EditTask)

    .post("/edit/task/:id", EditTaskpost)

    .get("/deleted", deletedtask)

    .get("/", validate(priorityCheck), taskpriority) // check priority

    .get("/priority", getAllTasks)

    .get("/paginate", getTasksByPriorityPagination)




module.exports = {
    route: router
}