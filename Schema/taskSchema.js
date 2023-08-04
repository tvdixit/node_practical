const { number } = require('joi');
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },
    image: {
        type: Array,
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    due_date: {
        type: Date,
        required: true,
    },
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium',
        required: true
    },
    is_completed: {
        type: Number,
        default: 0, // 0 for unCompleted, 1 for completed
        required: true
    },
    is_deleted: {
        type: Number,
        default: 0, // 0 for unCompleted, 1 for completed
        required: true
    },
    created_date: {
        type: Date,
        required: true,
        default: Date.now
    },
    token: {
        type: String,
    },
});

module.exports = mongoose.model('Task', TaskSchema)
