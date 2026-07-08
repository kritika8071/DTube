import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

// helper function to generate tokens
const generateTokens = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // save refresh token to database
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// SIGNUP
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if any field is empty
    if (!username || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    // check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ApiError(409, "User with this email or username already exists");
    }

    // create new user
    const user = await User.create({
      username,
      email,
      password,
    });

    // get created user without password
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while creating user");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User created successfully"));

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if fields are empty
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    // find user by email
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // check if user is banned
    if (user.isBanned) {
      throw new ApiError(403, "Your account has been banned");
    }

    // verify password
    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid credentials");
    }

    // generate tokens
    const { accessToken, refreshToken } = await generateTokens(user._id);

    // get user without sensitive fields
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: false,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(200, { user: loggedInUser, accessToken }, "Login successful")
      );

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

// SIGNOUT
const signout = async (req, res) => {
  try {
    // remove refresh token from database
    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: false,
    };

    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json(new ApiResponse(200, {}, "Logged out successfully"));

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // save token and expiry to database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    // create reset URL
    const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

    // send email
    await sendEmail({
      to: email,
      subject: "DTube Password Reset",
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset it. This link expires in 10 minutes.</p>
        <a href="${resetURL}">Reset Password</a>
        <p>If you didn't request this, ignore this email.</p>
      `,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password reset email sent"));

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      throw new ApiError(400, "Password is required");
    }

    // find user with valid token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(400, "Invalid or expired reset token");
    }

    // update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password reset successfully"));

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

export { signup, login, signout, forgotPassword, resetPassword };