const dotenv = require("dotenv");
dotenv.config();
const Task = require("../Schema/taskSchema");
const express = require('express');
const app = express();
app.use(express.json());

//Create Task Api
const createTask = async (req, res) => {
    console.log(req.body)
    try {
        const newTask = new Task({
            ...req.body,
        });
        const savedTask = await newTask.save();
        res.status(201).json({ savedTask });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
//Get Task Data by id:
const GetTaskData = async (req, res) => {
    try {
        const data = await Task.find({ user_id: req.user.user_id }).populate("user_id");
        res.json({ success: true, message: "retrive data successfully", data })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}
//Get Tasklist With Priority:
const TaskbyDESC = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ created_date: -1 }).exec();
        res.status(200).json({ tasks });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
}
//Task Pagination :
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
        const renderedTemplate = res.render('taskPagination', {
            tasks: tasks,
            page: page,
            limit: limit,
            search: search,
            total: totalCount,
            skip: skip,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//Get Deleted task :
const deletedtask = async (req, res) => {
    try {
        const tasks = await Task.find({ is_deleted: false }).exec();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
}
//Get Task by Priority :
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
//Get All Data Priority wise:
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.aggregate([
            {
                $match: { priority: { $in: ["high", "medium", "low"] } }
            },
            {
                $addFields: {
                    priorityOrder: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$priority", "high"] }, then: 1 },
                                { case: { $eq: ["$priority", "medium"] }, then: 2 },
                                { case: { $eq: ["$priority", "low"] }, then: 3 }
                            ],
                            default: 4
                        }
                    }
                }
            },
            {
                $sort: { priorityOrder: 1 }
            },
            {
                $project: { priorityOrder: 0 }
            }
        ]).exec();
        const tasksArray = tasks.map(task => ({ ...task }));
        // console.log(tasks, "taskdata");
        res.status(200).json(tasksArray);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tasks by priority' });
    }
};

//editTask in template
const EditTask = async (req, res) => {
    // try {
    //     console.log(req.body);
    //     const taskid = req.params.id;
    //     const updatedData = {
    //         name: req.body.name,
    //         description: req.body.description
    //     };
    //     console.log(req.params.id, updatedData);
    //     const updatedTask = await Task.findByIdAndUpdate(taskid, updatedData);

    //     if (!updatedTask) {
    //         return res.status(404).json({ message: 'Task not found' });
    //     }

    //     res.render('task_editPagination', { task: updatedTask });
    // } catch (error) {
    //     res.status(400).json({ message: error.message });
    // }

    try {
        const taskId = req.params.id;
        const task = await Task.findByIdAndUpdate(taskId);
        if (!task) {
            return res.status(404).send('Task not found');
        }
        res.render('task_editPagination', { task });
    } catch (error) {
        res.status(400).send('Error: ' + error.message);
    }
};
//
const EditTaskpost = async (req, res) => {
    try {
        const taskId = req.params.id;
        const updatedData = {
            name: req.body.name,
            description: req.body.description
        };
        const updatedTask = await Task.findByIdAndUpdate(taskId, updatedData);
        if (!updatedTask) {
            return res.status(404).send('Task not found');
        }
        const savedata = updatedTask.save()
        res.redirect('/task/Pagination');
    } catch (error) {
        res.status(400).send('Error: ' + error.message);
    }
}
// new gettask by priority pagination
const getTasksByPriorityPagination = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    try {
        const tasks = await Task.aggregate([
            {
                $match: { priority: { $in: ["high", "medium", "low"] } }
            },
            {
                $addFields: {
                    priorityOrder: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$priority", "high"] }, then: 1 },
                                { case: { $eq: ["$priority", "medium"] }, then: 2 },
                                { case: { $eq: ["$priority", "low"] }, then: 3 }
                            ],
                            default: 4
                        }
                    }
                }
            },
            {
                $sort: { priorityOrder: 1 }
            },
            {
                $project: { priorityOrder: 0 }
            },
            {
                $skip: (page - 1) * limit
            },
            {
                $limit: limit
            }
        ]).exec();

        const tasksArray = tasks.map(task => ({ ...task }));

        res.render('NewPagination', {
            tasksArray,
            tasks: tasks,
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            search: search
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tasks by priority' });
    }
};

module.exports = {
    createTask,
    GetTaskData,
    TaskbyDESC,
    TaskdataPagination,
    deletedtask,
    taskpriority,
    getAllTasks,
    EditTask,
    getTasksByPriorityPagination,
    EditTaskpost
}