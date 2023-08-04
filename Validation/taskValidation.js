const Joi = require("joi")

const CreateTaskValidation = {
    file: Joi.object().keys({
        Image: Joi.array().required()
    }),

    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
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

// const idValidation = Joi.object().keys({
//     user_id: Joi.string().required(),
// })


const taskidValidation = {
    query: Joi.object().keys({
        id: Joi.string().required(),
    })
}

const prioritySchema = {
    query: Joi.object().keys({
        priority: Joi.string().required(),
    })
}
module.exports = {
    CreateTaskValidation,
    idValidation,
    taskidValidation,
    prioritySchema
}