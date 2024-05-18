// jwtUtils.js
const jwt = require("jsonwebtoken");
const secretKey = process.env.secretKey;

function generateToken(payload) {
    return jwt.sign(payload, secretKey, { expiresIn: "12h" });
}

function jwtCheck(req, res, next) {
    // Check and verify the JWT token here
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const token = authorizationHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized - Invalid authorization header format" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Unauthorized - Token has expired' });
            }
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }
        req.user = decoded;
        next();
    });
}

module.exports = {
    generateToken,
    jwtCheck,
};
