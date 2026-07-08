import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";

const verifyJWT = async (req, res, next) => {
  try {
    // get token from cookies or header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // verify token
    const decodedToken = jwt.verify(
      token,
      process.env.DTUBE_CONSTELLATION_Conspiracy_SECRET
    );

    // find user from token
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    // attach user to request
    req.user = user;
    next();

  } catch (error) {
    return res
      .status(error.statusCode || 401)
      .json(new ApiError(error.statusCode || 401, error.message));
  }
};

export { verifyJWT };