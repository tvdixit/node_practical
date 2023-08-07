const dotenv = require("dotenv");
dotenv.config();
const User = require("../Schema/userSchema");
const bcrypt = require("bcrypt");

//Create User :
const createUser = async (req, res) => {
    console.log(req.body, "body")

    try {
        const { first_name, last_name, email, password } = req.body;

        // console.log(req.body);


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email is already taken." });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const userdata = new User({
            first_name,
            last_name,
            email,
            password: hashedPassword,

        })
        const savedata = await userdata.save();
        res.status(200).json({ savedata });


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