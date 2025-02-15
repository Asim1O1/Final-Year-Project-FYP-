import React, { useState } from "react";
import { Link, Link as useNavigate } from "react-router-dom";

import ImageSection from "./ImageSection";
import AuthLayout from "../../layouts/AuthLayout";
import { Box, Button, Flex, Heading, HStack, PinInput, PinInputField, Stack, Text } from "@chakra-ui/react";

// ForgotPassword Component
const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Add your OTP verification logic here
    setTimeout(() => {
      setIsLoading(false);
      navigate("/update-password");
    }, 2000);
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
                <HStack justify="center" spacing={4}>
                  <PinInput otp size="lg" value={otp} onChange={setOtp}>
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
                  <Link
                    color="#00A9FF"
                    textDecoration="none"
                    _hover={{
                      color: "#007BB5",
                    }}
                    onClick={() => {
                      /* Add resend logic */
                    }}
                  >
                    Resend
                  </Link>
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
