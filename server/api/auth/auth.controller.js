import bcryptjs from "bcryptjs";
import crypto from "crypto";
import doctorModel from "../../models/doctor.model.js";
import hospitalModel from "../../models/hospital.model.js";
import userModel from "../../models/user.model.js";
import { emailTemplates } from "../../utils/emailTemplates.js";
import {
  generateAccessToken,
  generatePasswordResetToken,
  generateRefreshToken,
} from "../../utils/generateAuthToken.js";
import createResponse from "../../utils/responseBuilder.js";
import { sendEmail } from "../../utils/sendEmail.js";
import {
  validateLoginInput,
  validateRegisterInput,
} from "../../utils/validationUtils.js";
import { logActivity } from "../activity/activity.controller.js";

/**
 * Handles user registration.
 */
export const handleUserRegistration = async (req, res, next) => {
  try {
    // Validate input
    await validateRegisterInput.validateAsync(req.body, { abortEarly: false });

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
    const subject = emailTemplates.registration.subject.replace(
      "{{firstName}}",
      fullName.split(" ")[0]
    );
    const template = emailTemplates.registration;

    const emailData = {
      fullName: newUser.fullName,
    };

    await sendEmail(newUser.email, subject, template, emailData);
    await logActivity("new_user", {
      title: "User Registered",
      description: `${newUser.fullName} (${newUser.email}) created an account`,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      userId: newUser._id,
      name: newUser.fullName,

      performedBy: {
        role: req.user?.role || "system_admin",
        userId: req.user?._id,
        name: req.user?.fullName,
      },

      visibleTo: ["system_admin"],
    });

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
      console.log("Account not found for email:", email);
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

    // Check if the account is active
    if (!account.isActive) {
      console.log(`Login attempt for deactivated account: ${email}`);
      return res.status(403).json(
        createResponse({
          isSuccess: false,
          statusCode: 403,
          message:
            "Your account has been deactivated. Please contact support for assistance.",
          error: null,
        })
      );
    }

    // ❗️ Check if user is hospital admin & their hospital is deleted
    if (user && user.role === "hospital_admin") {
      console.log("Checking if hospital admin's hospital is deleted...");
      const hospital = await hospitalModel.findOne({
        hospital_admin: user._id,
        isDeleted: true,
      });

      if (hospital) {
        return res.status(403).json(
          createResponse({
            isSuccess: false,
            statusCode: 403,
            message: "Your hospital has been deleted. Access denied.",
            error: null,
          })
        );
      }
    }

    const isPasswordValid = await bcryptjs.compare(password, account.password);
    if (!isPasswordValid) {
      console.log("Invalid password attempt for:", email);
      return res.status(401).json(
        createResponse({
          isSuccess: false,
          statusCode: 401,
          message: "Invalid credentials. Please check your email and password.",
          error: null,
        })
      );
    }

    // Determine account type
    const accountType = user ? "user" : "doctor";

    // Generate tokens with accountType
    const accessToken = generateAccessToken(account._id, accountType);
    const refreshToken = generateRefreshToken(account._id, accountType);

    const accountObject = account.toObject();
    // Remove sensitive or unnecessary fields
    delete accountObject.password;
    delete accountObject.resetPasswordOTP;
    delete accountObject.resetPasswordOTPExpiry;
    delete accountObject.resetPasswordAttempts;
    delete accountObject.resetPasswordLockUntil;
    delete accountObject.__v;

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

// Updated authentication check handler
export const verifyUserAuthentication = async (req, res, next) => {
  try {
    const { user } = req;

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

    // Check if user exists in either User or Doctor model
    const account =
      (await userModel.findById(user._id)) ||
      (await doctorModel.findById(user._id));

    if (!account) {
      return res.status(401).json(
        createResponse({
          isSuccess: false,
          statusCode: 401,
          message:
            "Account not found. The user does not exist in the database.",
          error: null,
        })
      );
    }

    // Convert Mongoose document to a plain object and remove sensitive info
    const plainUser = account.toObject();
    delete plainUser.password; // Ensure password is not exposed

    // Generate tokens with accountType
    const accountType = account instanceof userModel ? "user" : "doctor";
    const accessToken = generateAccessToken(account._id, accountType);
    const refreshToken = generateRefreshToken(account._id, accountType);

    // Set cookies for tokens
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 60 * 1000, // 30 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "User is authenticated.",
        data: plainUser, // Plain object without Mongoose properties
        accessToken,
        refreshToken,
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
    console.log("The reset token is", resetToken);

    // Update user with OTP and expiration
    user.resetPasswordOTP = hashedToken;
    user.resetPasswordOTPExpiry = expiresAt;
    await user.save();

    const template = {
      body: `
          <p>Dear {{fullName}},</p>
          <p>We received a request to reset your password. Please use the OTP below to proceed:</p>
          <h2 style="color: #2E86C1;">{{otp}}</h2>
          <p><strong>Note:</strong> This OTP is valid for only 10 minutes. Do not share it with anyone.</p>
          <p>If you did not request this, please ignore this email or contact our support team immediately.</p>
          <p>Best regards,<br><strong>MedConnect</strong></p>
        `,
    };

    const data = {
      name: user.name,
      otp: resetToken,
    };
    const subject = "🔒 Password Reset Request";

    await sendEmail(user.email, subject, template, data);

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
