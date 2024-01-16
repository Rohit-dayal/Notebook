const jwt = require('jsonwebtoken');
const JWT_SECRET = "Rohitisagood$boy"

const fetchuser = (req, res, next) => {
    // get user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ errors: "please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user
        next();
    } catch (error) {
        return res.status(401).send({ errors: "please authenticate using a valid token" });
    }

}
module.exports = fetchuser;