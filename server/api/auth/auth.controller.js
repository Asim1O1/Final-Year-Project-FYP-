import bcryptjs from "bcryptjs";
import userModel from "../../models/user.model.js";
import {
  validateLoginInput,
  validateRegisterInput,
} from "../../utils/validationUtils.js";
import {
  generateAccessToken,
  generatePasswordResetToken,
  generateRefreshToken,
} from "../../utils/generateAuthToken.js";
import createResponse from "../../utils/responseBuilder.js";
import { sendEmail } from "../../utils/sendEmail.js";
import crypto from "crypto";
import doctorModel from "../../models/doctor.model.js";

/**
 * Handles user registration.
 */
export const handleUserRegistration = async (req, res, next) => {
  try {
    // Validate input
    await validateRegisterInput.validateAsync(req.body);

    const {
      fullName,
      userName,
      email,
      password,
      address,
      role,
      phone,
      gender,
    } = req.body;

    console.log("The req.body in the handleUserRegistration is: ", req.body);

    // Check for existing user
    const existingUser = await userModel.findOne({
      $or: [{ email }, { userName }],
    });
    if (existingUser) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Registration failed. Email or username is already in use.",
          error: null,
        })
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const newUser = await userModel.create({
      fullName,
      userName,
      email,
      password: hashedPassword,
      address,
      role: role || "user",
      phone,
      gender,
    });

    const userObject = newUser.toObject();
    delete userObject.password;

    // Send success response
    return res.status(201).json(
      createResponse({
        isSuccess: true,
        statusCode: 201,
        message: "User registration successful.",
        data: userObject,
        error: null,
      })
    );
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Validation failed.",
          error: error.details.map((err) => err.message),
        })
      );
    }

    next(error);
  }
};

/**
 * Handles user login.
 */
export const handleUserLogin = async (req, res, next) => {
  try {
    await validateLoginInput.validateAsync(req.body);
    console.log("ENTERED THE LOGIN FUNCTION IN BACKEND");
    console.log("The req.body is", req.body);

    const { email, password } = req.body;
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Invalid request body.",
          error: null,
        })
      );
    }

    // Check both User and Doctor models
    const user = await userModel.findOne({ email });
    const doctor = await doctorModel.findOne({ email });

    const account = user || doctor;
    if (!account) {
      console.log("Account not found");
      return res.status(401).json(
        createResponse({
          isSuccess: false,
          statusCode: 401,
          message:
            "Authentication failed. Account with the provided email does not exist.",
          error: null,
        })
      );
    }

    const isPasswordValid = await bcryptjs.compare(password, account.password);
    if (!isPasswordValid) {
      console.log("Invalid password");
      return res.status(401).json(
        createResponse({
          isSuccess: false,
          statusCode: 401,
          message: "Invalid credentials. Please check your email and password.",
          error: null,
        })
      );
    }

    const accessToken = generateAccessToken(account._id);
    const refreshToken = generateRefreshToken(account._id);

    const accountObject = account.toObject();
    delete accountObject.password;

    console.log("Setting cookies for accessToken and refreshToken");
    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);

    // Set cookies for tokens
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    console.log("Cookies set successfully");

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Login successful. Welcome back!",
        data: accountObject,
        accessToken,
        refreshToken,
        error: null,
      })
    );
  } catch (error) {
    // Handle Joi validation errors
    if (error.isJoi) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Validation failed.",
          error: error.details.map((err) => err.message),
        })
      );
    }

    next(error);
  }
};
/**
 * Checks if a user is authenticated.
 */
export const verifyUserAuthentication = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json(
        createResponse({
          isSuccess: false,
          statusCode: 401,
          message:
            "Authentication required. Please log in to access this resource.",
          error: null,
        })
      );
    }

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "User is authenticated.",
        data: { ...user, role: user.role },
        error: null,
      })
    );
  } catch (error) {
    console.error("Authentication Check Error:", error.message);
    next(error);
  }
};

/**
 * Handles user logout.
 */
export const handleUserLogout = async (req, res) => {
  try {
    // Clear the accessToken and refreshToken cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Logout successful. You have been signed out.",
        data: null,
        error: null,
      })
    );
  } catch (error) {
    console.error("Logout Error:", error.message);
    next(error);
  }
};

export const handleForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "User not found.",
          error: null,
        })
      );
    }

    // Generate OTP and expiration time
    const { resetToken, hashedToken, expiresAt } = generatePasswordResetToken();

    // Update user with OTP and expiration
    user.resetPasswordOTP = hashedToken;
    user.resetPasswordOTPExpiry = expiresAt;
    await user.save();

    // Construct the email
    const subject = "🔒 Password Reset Request";
    const html = `
      <p>Dear ${user.name},</p>
      <p>We received a request to reset your password. Please use the OTP below to proceed:</p>
      <h2 style="color: #2E86C1;">${resetToken}</h2>
      <p><strong>Note:</strong> This OTP is valid for only 10 minutes. Do not share it with anyone.</p>
      <p>If you did not request this, please ignore this email or contact our support team immediately.</p>
      <p>Best regards,<br><strong>Your Company Name</strong></p>
    `;

    // Send the email
    await sendEmail(user.email, subject, html);

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Reset password OTP sent successfully.",
        error: null,
      })
    );
  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    next(error);
  }
};

export const handleOtpVerification = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    console.log("The body is", req.body);

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "User not found.",
          error: null,
        })
      );
    }

    // Hash the OTP from the request body using SHA-256
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    // Compare the hashed OTP with the stored hashed OTP in the database
    if (hashedOtp !== user.resetPasswordOTP) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Invalid OTP.",
          error: null,
        })
      );
    }

    // Check if account is locked
    if (
      user.resetPasswordLockUntil &&
      new Date() < user.resetPasswordLockUntil
    ) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Too many failed attempts. Try again later.",
          error: null,
        })
      );
    }

    // Check if OTP is expired
    if (new Date() > user.resetPasswordOTPExpiry) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "OTP expired. Please request a new one.",
          error: null,
        })
      );
    }

    // OTP is correct! Reset attempts & unlock account
    user.resetPasswordAttempts = 0;
    user.resetPasswordLockUntil = null;

    await user.save();

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "OTP verified successfully.",
        error: null,
      })
    );
  } catch (error) {
    console.error("OTP Verification Error:", error.message);
    next(error);
  }
};

export const handlePasswordReset = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    console.log("Thr req body is", req.body);

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "User not found.",
          error: null,
        })
      );
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    // Check if OTP matches and is not expired
    if (
      user.resetPasswordOTP !== hashedOtp ||
      new Date() > user.resetPasswordOTPExpiry
    ) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Invalid or expired OTP.",
          error: null,
        })
      );
    }

    // Hash new password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpiry = null;
    user.resetPasswordAttempts = 0;
    user.resetPasswordLockUntil = null;

    await user.save();

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Password reset successfully.",
        error: null,
      })
    );
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    next(error);
  }
};
