import jwt from "jsonwebtoken";

export const socketMiddleware = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    console.log("Socket Reject: No Token.");
    return next(new Error("No token provided."));
  }

  try {
    const secretKey = process.env.SECRET_KEY;
    jwt.verify(token, secretKey, (error, payload) => {
      if (error) {
        return next(new Error("Need Valid Authentication Credentials"));
      }

      // Save padload information
      socket.user = payload;

      next();
    });
  } catch (error) {
    return next(new Error("No token provided."));
  }
};
