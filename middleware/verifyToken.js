var jwt = require('jsonwebtoken');

if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

function verifyToken(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).json({
            auth: false,
            message: "Token is required!!!"
        });
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).json({auth: false, message: "Failed to authenticate token."});
        }
        console.log(decoded);
        req.userId = decoded.id;
        next();
    })
}

module.exports = verifyToken;