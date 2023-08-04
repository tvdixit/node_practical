const Joi = require("joi")

const CreateUserValidation = {
    body: Joi.object().keys({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
    })
}

const LoginValidation = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
    })
}

const idValidation = {
    user: Joi.object({
        user_id: Joi.string().required(),
    })
}
module.exports = {
    CreateUserValidation,
    LoginValidation,
    idValidation
}