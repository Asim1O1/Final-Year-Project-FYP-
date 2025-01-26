import bcryptjs from "bcryptjs";
import userModel from "../../models/user.model.js";
import {
  validateLoginInput,
  validateRegisterInput,
} from "../../utils/validationUtils.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateAuthToken.js";
import createResponse from "../../utils/responseBuilder.js";

/**
 * Handles user registration.
 */
export const handleUserRegistration = async (req, res) => {
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
    // Handle Joi validation errors
    if (error.isJoi) {
      console.error("Validation Error: ", error.details);
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Validation error",
          error: error.details.map((err) => err.message),
        })
      );
    }

    // Handle other errors
    console.error("Registration Error:", error.message);
    return res.status(500).json(
      createResponse({
        isSuccess: false,
        statusCode: 500,
        message:
          "An error occurred while processing your registration request.",
        error: error.message,
      })
    );
  }
};

/**
 * Handles user login.
 */
export const handleUserLogin = async (req, res) => {
  try {
    await validateLoginInput.validateAsync(req.body);
    console.log("ENTERED THE LOGIN FUNCTION IN BACKEND");

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
    const user = await userModel.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(401).json(
        createResponse({
          isSuccess: false,
          statusCode: 401,
          message:
            "Authentication failed. User with the provided email does not exist.",
          error: null,
        })
      );
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
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

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const userObject = user.toObject();
    delete userObject.password;

    // Debug: Check before setting cookies
    console.log("Setting cookies for accessToken and refreshToken");
    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);

    // Set cookies for tokens
    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 60 * 1000,
    });
    console.log("cookiee set succesfyll");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Debug: Verify cookies are set
    console.log("Cookies set successfully");

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Login successful. Welcome back!",
        data: userObject,
        accessToken,
        refreshToken,
        error: null,
      })
    );
  } catch (error) {
    // Handle Joi validation errors
    if (error.isJoi) {
      console.error("Validation Error: ", error.details);
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Validation error",
          error: error.details.map((err) => err.message), // Send array of error messages
        })
      );
    }

    console.error("Login Error:", error.message);
    return res.status(500).json(
      createResponse({
        isSuccess: false,
        statusCode: 500,
        message: "An error occurred while processing your login request.",
        error: error.message,
      })
    );
  }
};

/**
 * Checks if a user is authenticated.
 */
export const verifyUserAuthentication = async (req, res) => {
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
        data: user,
        error: null,
      })
    );
  } catch (error) {
    console.error("Authentication Check Error:", error.message);
    return res.status(500).json(
      createResponse({
        isSuccess: false,
        statusCode: 500,
        message: "An error occurred while verifying authentication.",
        error: error.message,
      })
    );
  }
};
