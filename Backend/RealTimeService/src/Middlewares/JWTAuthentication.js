import jwt from "jsonwebtoken";

export const authentication = (req, res, next) => {
  try {
    // public path = PASS
    const path = req.originalUrl;
    if (path.includes("/public/")) {
      return next();
    }

    // authentication
    const authHeader = req.headers.authorization ?? null;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const secretKey = process.env.SECRET_KEY;

      jwt.verify(token, secretKey, (error, payload) => {
        if (error) {
          return res.status(401).json({
            success: false,
            statusCode: 401,
            message: "Need Valid Authentication Credentials",
          });
        }

        req.user = payload;

        return next();
      });
    }

    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: "UnAuthorized",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: error.message,
    });
  }
};
