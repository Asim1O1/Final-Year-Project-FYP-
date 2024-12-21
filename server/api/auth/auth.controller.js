import bcryptjs from "bcryptjs";

import User from "../../models/user.model";
import { validateRegisterInput } from "../../utils/validationUtils.js";

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
        message: "Internal Server Error.",
        error: error.message,
      })
    );
  }
};
