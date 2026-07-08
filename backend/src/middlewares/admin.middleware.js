import ApiError from "../utils/ApiError.js";

const verifyAdmin = (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      throw new ApiError(403, "Access denied. Admins only.");
    }
    next();
  } catch (error) {
    return res
      .status(error.statusCode || 403)
      .json(new ApiError(error.statusCode || 403, error.message));
  }
};

export { verifyAdmin };