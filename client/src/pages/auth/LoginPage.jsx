import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import ImageSection from "../../component/auth/ImageSection";
import InputForm from "../../component/auth/InputForm";
import PasswordToggle from "../../component/auth/PasswordToggle";

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {};

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
                isLoading={loading}
                loadingText="Logging in..."
                mt={2}
                _hover={{
                  bg: "#007BB5",
                  transform: "scale(1.05)",
                }}
              >
                Login
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
