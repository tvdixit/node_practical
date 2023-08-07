const createUser = require("./userRoute");
const createTask = require("./taskRoute")
const UserTemplate = require("./UserTempRoute")
const taskTemplate = require("./TaskTempRoute")
const LoginTemplate = require("./LoginTempRoute")

module.exports = {
    createUser,
    createTask,
    UserTemplate,
    taskTemplate,
    LoginTemplate
}
