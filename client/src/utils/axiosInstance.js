import axios from "axios";
import authService from "../services/auth/auth.service";
import { BASE_BACKEND_URL } from "../../constants";

const axiosInstance = axios.create({
  baseURL: BASE_BACKEND_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response; // Simply return the response if no error
  },
  async (error) => {
    const originalRequest = error.config; // Get the original request that failed

    // If the error status is 401 (unauthorized) and the request hasn't been retried yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call the authService to refresh the access token
        const refreshResponse = await authService.refreshTokenService();

        // If refresh token request was successful
        if (refreshResponse?.isSuccess) {
          const newAccessToken = refreshResponse?.data?.accessToken;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          // Retry the original request with the new token
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Error refreshing access token:", refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
