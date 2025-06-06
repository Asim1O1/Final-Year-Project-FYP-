import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Spinner,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import ImageSection from "../../component/auth/ImageSection";
import InputForm from "../../component/auth/InputForm";
import PasswordToggle from "../../component/auth/PasswordToggle";
import { loginUser } from "../../features/auth/authSlice";
import AuthLayout from "../../layouts/AuthLayout";

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
            <Heading
              size="lg"
              color="gray.700"
              fontSize={{ base: "xl", md: "2xl" }}
              mb={{ base: 2, md: 4 }}
            >
              Login to your account
            </Heading>

            <form onSubmit={handleSubmit}>
              <Stack spacing={stackSpacing}>
                <InputForm
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isRequired
                  type="email"
                  placeholder="Enter your email"
                />

                <InputForm
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  isRequired
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  rightElement={
                    <PasswordToggle
                      showPassword={showPassword}
                      togglePasswordVisibility={() =>
                        setShowPassword(!showPassword)
                      }
                    />
                  }
                />

                <Flex justify="flex-end" align="center" mt={1}>
                  <Link
                    as={RouterLink}
                    to="/forgot-password"
                    color="#00A9FF"
                    fontSize="sm"
                    fontWeight="medium"
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
                  size={buttonSize}
                  isDisabled={isLoading}
                  mt={2}
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
                  {isLoading ? <Spinner size="sm" color="white" /> : "Login"}
                </Button>

                <Flex justify="center" mt={{ base: 4, md: 6 }}>
                  <Text fontSize="sm">
                    Don't have an account?{" "}
                    <Link
                      as={RouterLink}
                      to="/register"
                      color="#00A9FF"
                      fontWeight="medium"
                      _hover={{
                        color: "#007BB5",
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

export default LoginPage;
