import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Link,
  Stack,
  Text,
  Select,
  
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import ImageSection from "../../component/auth/ImageSection";
import InputForm from "../../component/auth/InputForm";
import PasswordToggle from "../../component/auth/PasswordToggle";
import { registerUser } from "../../features/auth/authSlice";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    gender: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(formData));
    console.log("The result is", result)

    if (registerUser.fulfilled.match(result)) {
      notification.success({
        message: "Registration Successful",
        description: result?.payload?.message || "Your account has been created successfully!",
        duration: 3, 
      });
      navigate("/login")
    } else if (registerUser.rejected.match(result)) {
      notification.error({
        message: "Registration Failed",
        description:
          result?.payload?.error || "Something went wrong. Please try again.",
        duration: 3,
      });
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
              Create your account
            </Heading>

            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <Grid
                  templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }}
                  gap={4}
                >
                  <InputForm
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    isRequired
                  />
                  <InputForm
                    label="Username"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    isRequired
                  />
                </Grid>
                <Grid
                  templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }}
                  gap={4}
                >
                  <InputForm
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    isRequired
                    pattern="\d{10}"
                    maxLength={10}
                    placeholder="Enter 10 digit number"
                  />
                  <Box>
                    <Text mb={2} fontWeight="medium">
                      Gender *
                    </Text>
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      placeholder="Select gender"
                      required
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Select>
                  </Box>
                </Grid>
                <Grid
                  templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }}
                  gap={4}
                >
                  <InputForm
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isRequired
                  />
                  <InputForm
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
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
                </Grid>

                <InputForm
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
                <Button
                  type="submit"
                  bg="#00A9FF"
                  color="white"
                  size="lg"
                  isLoading={isLoading}
                  loadingText="Creating account..."
                  mt={2}
                  _hover={{
                    bg: "#007BB5",
                    transform: "scale(1.05)",
                  }}
                >
                  Create account
                </Button>

                <Flex justify="center">
                  <Text>
                    Already have an account?{" "}
                    <Link
                      as={RouterLink}
                      to="/login"
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
                      Login
                    </Link>
                  </Text>
                </Flex>
              </Stack>
            </form>
          </Stack>
        </Box>
        <ImageSection
          imageUrl="/MedConnect avatar.png"
          boxSize={{ base: "80%", md: "40%" }}
        />
      </Flex>
    </AuthLayout>
  );
};

export default RegisterPage;
