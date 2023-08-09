const dotenv = require("dotenv");
dotenv.config();
const User = require("../Schema/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//Create User :
const createUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ message: "Email is already taken." });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const userdata = new User({
            ...req.body,
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
//userlogin api :
const Userlogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const users = await User.findOne({ email })
        console.log(users);
        if (!users) {
            return res.status(401).json("invalid email or password")
        }
        const matchPassword = await bcrypt.compare(password, users.password)
        if (!matchPassword) {
            res.status(400).json({ message: 'password not match Try again' })
        } else {
            const token = jwt.sign({ user_id: users._id, email }, process.env.SECRET_KEY, { expiresIn: '24h' });
            res.status(200).json({ token })
        }
    } catch (err) {
        res.status(400).json({ message: "Error" });
        console.log(err);
    }
};
module.exports = {
    createUser,
    GetUserData,
    Userlogin
}