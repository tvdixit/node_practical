const dotenv = require("dotenv");
dotenv.config();
const User = require("../Schema/userSchema");
const bcrypt = require("bcrypt");

//Create User :
const createUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email is already taken." });
        }
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async function (err, hash) {
            if (err) {
                return res.status(500).json({ message: "An error occurred while hashing the password." });
            }
            const userdata = new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: hash,

            })
            const savedata = await userdata.save();
            res.status(200).json({ savedata });
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
//Get User Data by id :
const GetUserData = async (req, res) => {
    try {
        const data = await User.findOne({ _id: req.user.user_id });
        res.json({ success: true, message: "retrive data successfully", data })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}
module.exports = {
    createUser,
    GetUserData
}