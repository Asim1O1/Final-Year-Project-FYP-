import { useNavigate } from "react-router-dom";
import ImageSection from "./ImageSection";
import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import InputForm from "./InputForm";
import PasswordToggle from "./PasswordToggle";
import { resetPassword } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { notification } from "antd";

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.otp || !formData.password) {
      notification.error({
        message: "Missing Fields",
        duration: 3,
        description: "All fields are required.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await dispatch(
        resetPassword({
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.password,
        })
      );

      console.log("Reset Password Response:", result);

      if (result?.payload?.isSuccess) {
        notification.success({
          message: "Password Updated Successfully",
          duration: 3,
          description: "You can now log in with your new password.",
        });
        navigate("/login");
      } else {
        notification.error({
          message: "Password Reset Failed",
          duration: 3,
          description:
            result?.payload?.error || "An unexpected error occurred.",
        });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      notification.error({
        message: "Something Went Wrong",
        duration: 3,
        description: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="center"
        w="100%"
        px={{ base: 4, md: 8 }}
        py={{ base: 8, md: 12 }}
        gap={{ base: 6, md: 12 }}
      >
        <Box w={{ base: "100%", md: "55%" }} p={6}>
          <StackDivider spacing={6}>
            <Heading size="lg" color="gray.700">
              Update Password
            </Heading>
            <Text color="gray.600">
              Please enter your details to reset your password.
            </Text>

            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <InputForm
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  isRequired
                />
                <InputForm
                  label="OTP"
                  type="text"
                  value={formData.otp}
                  onChange={(e) =>
                    setFormData({ ...formData, otp: e.target.value })
                  }
                  isRequired
                />
                <InputForm
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  isRequired
                  rightElement={
                    <PasswordToggle
                      showPassword={showPassword}
                      togglePasswordVisibility={() =>
                        setShowPassword(!showPassword)
                      }
                    />
                  }
                />

                <Button
                  type="submit"
                  bg="#00A9FF"
                  color="white"
                  size="lg"
                  isLoading={isLoading}
                  loadingText="Updating password..."
                  _hover={{
                    bg: "#007BB5",
                    transform: "scale(1.05)",
                  }}
                >
                  Update Password
                </Button>
              </Stack>
            </form>
          </StackDivider>
        </Box>
        <Box
          display={{ base: "none", md: "flex" }}
          w="50%"
          h="100%"
          position="relative"
          alignItems="center"
          justifyContent="center"
          bg="gray.50"
          overflow="hidden"
        >
          <ImageSection imageUrl="/MedConnect avatar.png" />
        </Box>
      </Flex>
    </AuthLayout>
  );
};

export default UpdatePassword;
