const Joi = require("joi")

const CreateTaskValidation = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string(),
        user_id: Joi.string().required(),
        due_date: Joi.date().required(),
        priority: Joi.string().valid('high', 'medium', 'low').required(),
        is_completed: Joi.number().required(),
        is_deleted: Joi.number().required(),
    })
}
const idValidation = {
    user: Joi.object({
        user_id: Joi.string().required(),
    })
}
const taskidValidation = {
    query: Joi.object().keys({
        id: Joi.string().required(),
    })
}
const priorityCheck = {
    query: Joi.object().keys({
        priority: Joi.string().required(),
    })
}
module.exports = {
    CreateTaskValidation,
    idValidation,
    taskidValidation,
    priorityCheck
}