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
//editTask in template
const EditTask = async (req, res) => {
    try {

        const task = await Task.findByIdAndUpdate(req.params.id);
        if (!task) {
            return res.status(404).send('Task not found');
        }
        res.render('task_editPagination', { task });
    } catch (error) {
        res.status(400).send('Error: ' + error.message);
    }
};
//EditTask Post :
const EditTaskpost = async (req, res) => {
    try {
        const taskId = req.params.id;
        const { name, description, is_completed, is_deleted } = req.body
        const updatedTask = await Task.findByIdAndUpdate(taskId, { name, description, is_completed, is_deleted });
        if (!updatedTask) {
            return res.status(404).send('Task not found');
        }
        const savedata = updatedTask.save()
        res.redirect('/task/Paginate')
        // res.redirect('/task/Pagination')
    } catch (error) {
        res.status(400).send('Error: ' + error.message);
    }
}
//new gettask by priority pagination:
const getTasksByPriorityPagination = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let priority = req.query.priority;
    const search = req.query.search || '';
    let is_completed = req.query.is_completed;
    let is_deleted = req.query.is_deleted;

    try {
        const allowedPriorities = ['high', 'medium', 'low'];
        if (!allowedPriorities.includes(priority)) {
            priority = 'all';
        }
        const allowedOptions = ['0', '1'];
        if (!allowedOptions.includes(is_completed)) {
            is_completed = 'all';
        }
        if (!allowedOptions.includes(is_deleted)) {
            is_deleted = 'all';
        }
        const matchStage = {
            $and: [
                priority === 'all' ? {} : { priority: priority },
                is_completed === 'all' ? {} : { is_completed: parseInt(is_completed) },
                is_deleted === 'all' ? {} : { is_deleted: parseInt(is_deleted) }
            ]
        };
        const tasks = await Task.aggregate([{ $match: matchStage },
        {
            $addFields: {
                priorityOrder: {
                    $switch: {
                        branches: [
                            { case: { $eq: ["$priority", "high"] }, then: 1 },
                            { case: { $eq: ["$priority", "medium"] }, then: 2 },
                            { case: { $eq: ["$priority", "low"] }, then: 3 }
                        ], default: 4
                    }
                }
            }
        },
        { $sort: { priorityOrder: 1 } },
        { $project: { priorityOrder: 0 } },
        { $skip: (page - 1) * limit },
        { $limit: limit }
        ]).exec();
        const tasksArray = tasks.map(task => ({ ...task }));
        res.render('NewPagination', {
            tasksArray,
            tasks: tasks,
            page: page,
            limit: limit,
            search: search,
            priority: priority,
            is_completed: is_completed,
            is_deleted: is_deleted
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

module.exports = {
    createTask,
    GetTaskData,
    TaskdataPagination,
    EditTask,
    getTasksByPriorityPagination,
    EditTaskpost,
}