const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req?.headers?.authorization?.split(' ')[1];
        if (!token) {
            return res.status(200).json({ message: "Access token missing" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
        if (!decoded) {
            return res.status(200).send({ message: "Unauthorized access" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = { auth };

