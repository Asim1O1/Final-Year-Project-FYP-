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

    // Handle failed responses with isSuccess === false
    if (response?.data?.isSuccess === false) {
      return createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Registration failed",
        error: response?.data?.error || null,
      });
    }

    // Successful response
    return createApiResponse({
      isSuccess: true,
      message: response?.data?.message || "Registration successful",
      data: response?.data?.data, // Adjusted to return `data` for consistency
    });
  } catch (error) {
    console.error("Error in registerService function:", error?.response);

    // Handle Axios response errors or fallback to a default error
    const errorMessage =
      Array.isArray(error?.response?.data?.error) &&
      error?.response?.data?.error.length > 0
        ? error.response.data.error[0] // Extract the first error if it's an array
        : error?.response?.data?.message ||
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
      userCredentials,
      {
        withCredentials: true,
      }
    );

    console.log("The response in the login service is:", response);

    // Handle failed responses with isSuccess === false
    if (response?.data?.isSuccess === false) {
      return createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Login failed",
        error: response?.data?.error || null,
      });
    }

    // Successful response
    return createApiResponse({
      isSuccess: true,
      data: response?.data?.data,
    });
  } catch (error) {
    console.error("Error in loginService function:", error?.response);

    // Handle Axios response errors or fallback to a default error
    const errorMessage =
      Array.isArray(error?.response?.data?.error) &&
      error?.response?.data?.error.length > 0
        ? error.response.data.error[0]
        : error?.response?.data?.message || "An error occurred during login.";

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

const refreshTokenService = async () => {
  try {
    const response = await axios.post(
      `${BASE_BACKEND_URL}/api/auth/refreshAcessToken`,
      {},
      { withCredentials: true }
    );

    console.log("The response in the refreshTokenService is:", response);
  } catch (error) {
    console.error("Error in refreshTokenService function:", error?.response);

    // Handle Axios response errors or fallback to a default error
    const errorMessage =
      error?.response?.data?.message ||
      "An error occurred while refreshing the access token.";

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
  refreshTokenService,
};

export default authService;
