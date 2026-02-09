export const authorization = (roles = []) => {
  if (typeof roles === "string") roles = [roles];

  const checkRole = (req, res, next) => {
    if (roles.some((value) => value === req.user.role)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      statusCode: 403,
      message: "Forbidden",
    });
  };

  return checkRole;
};
