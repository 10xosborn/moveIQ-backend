const jwt = require("jsonwebtoken");

// middleware to protect routes using JWT
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // check if token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "No token, not authorized" });
    }

    // get token from header
    const token = authHeader.split(" ")[1];

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // save user id in request
    req.user = { id: decoded.id };

    // go to next middleware
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Token invalid or expired" });
  }
};

module.exports = protect;