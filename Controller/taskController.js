const dotenv = require("dotenv");
dotenv.config();
const Task = require("../Schema/taskSchema");


const createTask = async (req, res) => {
    try {
        console.log(req.body.image, "body")
        let newobject = []
        for (let i = 0; i < req.files.length; i++) {
            newobject.push(req.files[i].filename)
        }
        const newTask = new Task({
            name: req.body.name,
            description: req.body.description,
            image: newobject,
            user_id: req.body.user_id,
            due_date: req.body.due_date,
            priority: req.body.priority,
            is_completed: req.body.is_completed,
            is_deleted: req.body.is_deleted
        });
        const savedTask = await newTask.save();
        res.status(201).json({ savedTask });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

//get task data by id:
const GetTaskData = async (req, res) => {
    try {
        const data = await Task.find({ user_id: req.user.user_id }).populate("user_id");
        res.json({ success: true, message: "retrive data successfully", data })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// get tasklist with priority:
const TaskbyDESC = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ created_date: -1 }).exec();
        res.status(200).json({ tasks });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
}
// task pagination :
const TaskdataPagination = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;
    try {
        const query = search ? { name: { $regex: search, $options: "i" } } : {};

        const totalCount = await Task.countDocuments(query);

        const tasks = await Task.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ created_date: -1 })
            .exec();

        res.status(200).json({
            tasks: tasks,
            page: page,
            limit: limit,
            search: search,
            total: totalCount,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}


// delete task by token :
const deleteTaskData = async (req, res) => {
    try {
        const data = await Task.findOneAndDelete({ user_id: req.user.user_id });
        res.json({ success: true, message: "delete data successfully", data })

    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// update task status _iscompleted
const updatetask = async (req, res) => {
    // const taskId = req.params.id;

    // console.log(req.user, "user")
    try {
        const task = await Task.findById(req.query.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        // console.log(task.user_id, "task");
        // console.log(req.query.id, "query")
        // console.log(req.user.user_id, "user");
        if (task.user_id == req.user.user_id) {
            task.is_completed = 1;
            const updatedTask = await task.save();

            res.status(200).json(updatedTask);
        } else {
            res.status(400).json({ error: "user_id is not match" })
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark the task as completed' });
    }
}

// delete task status is_deleted
const deletetask = async (req, res) => {
    try {
        const task = await Task.findById(req.query.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        if (task.user_id == req.user.user_id) {
            task.is_deleted = 1;
            const updatedTask = await task.save();
            res.status(200).json(updatedTask);
        } else {
            res.status(400).json({ error: "user_id is not match" })
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark the task as deleted' });
    }
}

// get deleted task :
const deletedtask = async (req, res) => {
    try {
        const tasks = await Task.find({ is_deleted: false }).exec();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
}

//get task priority :

const taskpriority = async (req, res) => {
    const priority = req.query.priority.toLowerCase();

    if (!['high', 'medium', 'low'].includes(priority)) {
        return res.status(400).json({ error: 'Invalid priority. Priority must be high, medium, or low.' });
    }

    try {
        const tasks = await Task.find({ priority: priority });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
module.exports = {
    createTask,
    GetTaskData,
    TaskbyDESC,
    TaskdataPagination,
    deleteTaskData,
    updatetask,
    deletetask,
    deletedtask,
    taskpriority
}