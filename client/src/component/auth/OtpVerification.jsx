import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import ImageSection from "./ImageSection";
import AuthLayout from "../../layouts/AuthLayout";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  PinInput,
  PinInputField,
  Stack,
  Text,
  Input,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { verifyOtp } from "../../features/auth/authSlice";
import { notification } from "antd";

// Handle input change function
const handleInputChange = (setter) => (value) => {
  setter(value);
};

// OTPVerification Component

const OTPVerification = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await dispatch(verifyOtp({ email, otp }));
      console.log("OTP Verification Response:", result);

      if (result?.payload?.isSuccess) {
        // Success: OTP verified
        notification.success({
          message: result?.payload?.message || "OTP Verified Successfully",
          duration: 3,
          description:
            "Your OTP has been verified. You can now update your password.",
        });
        navigate("/update-password");
      } else {
        // Error from backend response
        notification.error({
          message: result?.payload?.message || "OTP Verification Failed",
          duration: 3,
          description:
            result?.payload?.error || "Invalid OTP. Please try again.",
        });
      }
    } catch (error) {
      // Catch unexpected errors
      console.error("Error during OTP verification:", error);
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
          <Stack spacing={6}>
            <Heading size="lg" color="gray.700">
              Enter OTP
            </Heading>
            <Text color="gray.600">
              Please enter the OTP sent to your email address.
            </Text>

            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                {/* Email Input, this is  */}
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="lg"
                  isRequired
                />

                {/* OTP Input */}
                <HStack justify="center" spacing={4}>
                  <PinInput
                    otp
                    size="lg"
                    value={otp}
                    onChange={handleInputChange(setOtp)}
                  >
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                  </PinInput>
                </HStack>

                <Button
                  type="submit"
                  bg="#00A9FF"
                  color="white"
                  size="lg"
                  isLoading={isLoading}
                  loadingText="Verifying..."
                  _hover={{
                    bg: "#007BB5",
                    transform: "scale(1.05)",
                  }}
                >
                  Verify OTP
                </Button>

                <Flex justify="center" gap={2}>
                  <Text>Didn't receive the code?</Text>
                  <RouterLink
                    to="#"
                    style={{ color: "#00A9FF", textDecoration: "none" }}
                    onClick={() => {}}
                  >
                    Resend
                  </RouterLink>
                </Flex>
              </Stack>
            </form>
          </Stack>
        </Box>
        <ImageSection imageUrl="/MedConnect avatar.png" />
      </Flex>
    </AuthLayout>
  );
};

export default OTPVerification;
