const jwt = require("jsonwebtoken");

const config = process.env;

const verifyTokenSocket = (socket, next) => {
  const token = socket.handshake.auth?.token;

  // If no token is provided, return an error
  if (!token) {
    const socketError = new Error("Token is required");
    socketError.code = "TOKEN_REQUIRED";
    return next(socketError);
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    socket.user = decoded;  // Attach the decoded user data to the socket
  } catch (err) {
    // If token is invalid or expired, return a custom error
    const socketError = new Error("Invalid or expired token");
    socketError.code = "INVALID_TOKEN";
    return next(socketError);
  }

  next(); // Proceed to the next middleware or event handler
};

module.exports = verifyTokenSocket;
