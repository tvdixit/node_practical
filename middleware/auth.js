const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// decode token and get user_id :
const auth = () => async (req, res, next) => {
    const headerToken = req.headers.authorization;
    if (!headerToken) {
        return res.status(400).json({
            status: 401,
            message: "No token provided.",
        });
    }
    if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
        return res.status(400).json({
            status: 401,
            message: "Invalid token.",
        });
    }
    const token = headerToken && headerToken.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
        if (user) {
            req.user = { user_id: user.user_id, email: user.email };
            next();
        } else {
            return res.status(400).json({
                status: 401,
                message: "Unauthorized",
            });
        }
    });
};



module.exports = {
    // Userlogin,
    auth
}