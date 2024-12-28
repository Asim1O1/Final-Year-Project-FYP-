import bcryptjs from "bcryptjs";

import User from "../../models/user.model";
import {
  validateLoginInput,
  validateRegisterInput,
} from "../../utils/validationUtils.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateAuthToken.js";

/**
 * Handles user registration.
 */
export const registerUser = async (req, res, next) => {
  try {
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

    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Email or Username already in use.",
          error: null,
        })
      );
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await User.create({
      fullName,
      userName,
      email,
      password: hashedPassword,
      address,
      role,
      phone,
      gender,
    });

    const userObj = newUser.toObject();
    delete userObj.password;

    return res.status(201).json(
      createResponse({
        isSuccess: true,
        statusCode: 201,
        message: "User registered successfully.",
        data: userObj,
        error: null,
      })
    );
  } catch (error) {
    console.error("Error registering user:", error.message);
    return res.status(500).json(
      createResponse({
        isSuccess: false,
        statusCode: 500,
        message: "An unexpected error occurred during registration.",
        error: error.message,
      })
    );
  }
};

/**
 * Handles user login.
 */
export const loginUser = async (req, res, next) => {
  try {
    await validateLoginInput.validateAsync(req.body);

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json(
        createResponse({
          isSuccess: false,
          statusCode: 401,
          message: "Login failed. User with the provided email does not exist.",
          error: null,
        })
      );
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json(
        createResponse({
          isSuccess: false,
          statusCode: 401,
          message: "Invalid credentials.",
          error: null,
        })
      );
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const userObj = user.toObject();
    delete userObj.password;

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 30 * 60 * 1000,
    });
    console.log("cookiee set succesfyll");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "User logged in successfully.",
        data: userObj,
        error: null,
      })
    );
  } catch (error) {
    return res.status(500).json(
      createResponse({
        isSuccess: false,
        statusCode: 500,
        message: "Internal Server Error.",
        error: error.message,
      })
    );
  }
};
