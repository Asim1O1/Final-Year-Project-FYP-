import React, { useState } from "react";
import { Link, Link as RouterLink, useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import InputForm from "./InputForm";
import ImageSection from "./ImageSection";
import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";

// ForgotPassword Component
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Add your email verification logic here
    setTimeout(() => {
      setIsLoading(false);
      navigate("/verify-otp");
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
              Forgot Password
            </Heading>
            <Text color="gray.600">
              Enter your email address and we'll send you an OTP to reset your
              password.
            </Text>

            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <InputForm
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isRequired
                />
                <Button
                  type="submit"
                  bg="#00A9FF"
                  color="white"
                  size="lg"
                  isLoading={isLoading}
                  loadingText="Sending OTP..."
                  _hover={{
                    bg: "#007BB5",
                    transform: "scale(1.05)",
                  }}
                >
                  Send OTP
                </Button>

                <Flex justify="center">
                  <Link
                    as={RouterLink}
                    to="/login"
                    color="#00A9FF"
                    textDecoration="none"
                    _hover={{
                      color: "#007BB5",
                    }}
                  >
                    Back to Login
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

export default ForgotPassword;
