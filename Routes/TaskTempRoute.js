const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const app = express();
const router = express.Router();
const ejs = require('ejs');
app.set('view engine', 'ejs');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
const multer = require('multer');
const { createTask, TaskdataPagination, UpdateTask, EditTask } = require("../Controller/taskController")

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


router.get("/form", (req, res) => {
    res.render('taskTemplate');
})

router.post("/createtask", upload.single("image"), createTask)



// router.get("/pagination", (req, res) => {
//     res.render('task_pagination');
// })

// router.post("/tasks", TaskdataPagination)

router.get('/pagination', TaskdataPagination)

router.get("/update-task/:id", EditTask)


module.exports = {
    route: router
}