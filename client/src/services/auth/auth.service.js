import axios                from "axios";

import { BASE_BACKEND_URL } from "../../../constants";

const registerService = async (userData) => {
  try {
    const response = await axios.post(
      `${BASE_BACKEND_URL}/api/auth/register`,
      userData
    );
    console.log("The response in the registerService was: ", response);
    return response?.data;
  } catch (error) {
    console.error("Error in registerNewUser function:", error);
    return error;
  }
};

const authService = {
  registerService,
};

export default authService;
