import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import ImageSection from "../../component/auth/ImageSection";
import InputForm from "../../component/auth/InputForm";
import PasswordToggle from "../../component/auth/PasswordToggle";
import { notification } from "antd";
import { loginUser } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

const LoginPage = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading } = useSelector((state) => state?.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(loginUser(formData));
    console.log("The result is", result);

    if (loginUser.fulfilled.match(result)) {
      console.log("Login successful, let App.jsx handle navigation.");
    } else if (loginUser.rejected.match(result)) {
      notification.error({
        message: "Login Failed",
        description:
          result?.payload?.error || "Something went wrong. Please try again.",
        duration: 3,
      });
    }
  };

  return (
    <AuthLayout>
      <Box w={{ base: "100%", md: "55%" }} p={6}>
        <Stack spacing={6}>
          <Heading size="lg" color="gray.700">
            Login to your account
          </Heading>

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <InputForm
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                isRequired
                type="email"
              />

              <InputForm
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                isRequired
                type={showPassword ? "text" : "password"}
                rightElement={
                  <PasswordToggle
                    showPassword={showPassword}
                    togglePasswordVisibility={() =>
                      setShowPassword(!showPassword)
                    }
                  />
                }
              />

              <Flex justify="space-between" align="center">
                <Link
                  as={RouterLink}
                  to="/forgot-password"
                  color="#00A9FF"
                  textDecoration="none"
                  _hover={{
                    color: "#007BB5",
                  }}
                  _focus={{
                    textDecoration: "none",
                  }}
                >
                  Forgot password?
                </Link>
              </Flex>

              <Button
                type="submit"
                bg="#00A9FF"
                color="white"
                size="lg"
                isDisabled={isLoading}
                mt={2}
                _hover={{
                  bg: "#007BB5",
                  transform: "scale(1.05)",
                }}
              >
                {isLoading ? <Spinner size="sm" color="white" /> : "Login"}
              </Button>

              <Flex justify="center">
                <Text>
                  Don't have an account?{" "}
                  <Link
                    as={RouterLink}
                    to="/register"
                    color="#00A9FF"
                    textDecoration="none"
                    _hover={{
                      color: "#007BB5",
                      transform: "scale(1.05)",
                    }}
                    _focus={{
                      textDecoration: "none",
                    }}
                  >
                    Register
                  </Link>
                </Text>
              </Flex>
            </Stack>
          </form>
        </Stack>
      </Box>
      <ImageSection imageUrl="/MedConnect avatar.png" />
    </AuthLayout>
  );
};

export default LoginPage;
