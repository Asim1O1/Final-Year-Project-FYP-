import axios from "axios";

import { BASE_BACKEND_URL } from "../../../constants";
import createApiResponse from "../../utils/createApiResponse";

const registerService = async (userData) => {
  try {
    const response = await axios.post(
      `${BASE_BACKEND_URL}/api/auth/register`,
      userData
    );
    console.log("The response in the registerService was: ", response);

    if (response?.data?.isSuccess === false) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Registration failed",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message: response?.data?.message || "Registration successful",
      data: response?.data,
    });
  } catch (error) {
    console.error("Error in registerNewUser function:", error?.response);

    const errorMessage =
      error?.response?.data?.error?.[0] ||
      error?.response?.data?.message ||
      "An error occurred during registration.";

    return createApiResponse({
      isSuccess: false,
      error: errorMessage,
    });
  }
};

const loginService = async (userCredentials) => {
  try {
    const response = await axios.post(
      `${BASE_BACKEND_URL}/api/auth/login`,
      userCredentials
    );

    if (response?.data?.isSuccess === false) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Login failed",
        error: response?.data || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message: response?.data?.message || "Login successful",
      data: response?.data,
    });
  } catch (error) {
    console.error("Error in loginService function:", error?.response);

    const errorMessage =
      error?.response?.data?.message || "An error occurred during login.";

    return createApiResponse({
      isSuccess: false,
      error: errorMessage,
    });
  }
};

const verifyUserAuthService = async () => {
  try {
    const response = await axios.get(
      `${BASE_BACKEND_URL}/api/auth/verifyUserAuth`,
      { withCredentials: true }
    );

    // Handle successful response
    if (response?.data?.isSuccess) {
      return createApiResponse({
        isSuccess: true,
        message: response?.data?.message || "User authentication verified",
        data: response?.data?.data,
      });
    } else {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "User authentication failed",
        error: response?.data || null,
      });
    }
  } catch (error) {
    console.error("Error in verifyUserAuth function:", error?.response);

    const errorMessage =
      error?.response?.data?.message ||
      "An error occurred while verifying authentication.";

    return createApiResponse({
      isSuccess: false,
      error: errorMessage,
    });
  }
};

const authService = {
  registerService,
  loginService,
  verifyUserAuthService,
};

export default authService;
