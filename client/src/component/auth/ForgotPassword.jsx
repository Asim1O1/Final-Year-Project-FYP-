import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthLayout from "../../layouts/AuthLayout";
import InputForm from "./InputForm";
import ImageSection from "./ImageSection";
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { forgotPassword } from "../../features/auth/authSlice";
import { notification } from "antd";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await dispatch(forgotPassword(email));
      console.log("Forgot Password Response:", result);

      if (result?.payload?.isSuccess) {
        notification.success({
          message: "OTP Sent Successfully",
          duration: 3,
          description: "Please check your email inbox for the OTP.",
        });
        navigate("/verify-otp");
      } else {
        notification.error({
          message: result?.payload?.message || "Failed to Send OTP",
          duration: 3,
          description:
            result?.payload?.error || "An error occurred. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      notification.error({
        message: "Something Went Wrong",
        duration: 3,
        description: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stackSpacing = useBreakpointValue({ base: 4, md: 6 });
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" });

  return (
    <AuthLayout>
      <Flex direction={{ base: "column", md: "row" }} h="100%" overflow="auto">
        <Box
          w={{ base: "100%", md: "50%" }}
          p={{ base: 4, sm: 6, md: 8, lg: 10 }}
          display="flex"
          alignItems="center"
        >
          <Stack
            spacing={stackSpacing}
            w="100%"
            maxW={{ base: "100%", md: "400px" }}
            mx="auto"
          >
            <Stack spacing={3}>
              <Heading
                color="gray.700"
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="bold"
              >
                Forgot Password?
              </Heading>
              <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                Enter your email address and we'll send you an OTP to reset your
                password.
              </Text>
            </Stack>

            <form onSubmit={handleSubmit}>
              <Stack spacing={stackSpacing}>
                <InputForm
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={handleInputChange(setEmail)}
                  isRequired
                  placeholder="Enter your email address"
                />

                <Button
                  type="submit"
                  bg="#00A9FF"
                  color="white"
                  size={buttonSize}
                  isLoading={isLoading}
                  loadingText="Sending OTP..."
                  py={6}
                  position="relative"
                  transition="all 0.2s"
                  _hover={{
                    bg: "#007BB5",
                    transform: "translateY(-1px)",
                    boxShadow: "md",
                  }}
                  _active={{
                    transform: "translateY(0)",
                    boxShadow: "sm",
                  }}
                >
                  Send OTP
                </Button>

                <Flex justify="center" mt={{ base: 2, md: 4 }}>
                  <RouterLink to="/login">
                    <Text
                      color="#00A9FF"
                      fontSize="sm"
                      fontWeight="medium"
                      display="flex"
                      alignItems="center"
                      gap={1}
                      _hover={{
                        color: "#007BB5",
                        textDecoration: "underline",
                      }}
                    >
                      <span>←</span> Back to Login
                    </Text>
                  </RouterLink>
                </Flex>
              </Stack>
            </form>
          </Stack>
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

export default ForgotPassword;
