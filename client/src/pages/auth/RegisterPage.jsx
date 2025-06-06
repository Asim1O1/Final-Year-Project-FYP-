import { CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Select,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { notification } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import ImageSection from "../../component/auth/ImageSection";
import PasswordToggle from "../../component/auth/PasswordToggle";
import { registerUser } from "../../features/auth/authSlice";
// Adjust path as needed

const RegisterPage = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Form data state
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    gender: "",
  });

  // Form validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Validation schema
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "fullName":
        if (!value.trim()) {
          error = "Full name is required";
        } else if (value.trim().length < 3) {
          error = "Full name must be at least 3 characters";
        } else if (value.trim().length > 50) {
          error = "Full name cannot exceed 50 characters";
        } else if (!/^[a-zA-Z\s.'-]+$/.test(value)) {
          error =
            "Full name can only contain letters, spaces, and basic punctuation";
        }
        break;

      case "userName":
        if (!value.trim()) {
          error = "Username is required";
        } else if (value.trim().length < 3) {
          error = "Username must be at least 3 characters";
        } else if (value.trim().length > 20) {
          error = "Username cannot exceed 20 characters";
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error = "Username can only contain letters, numbers, and underscores";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;

      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = "Password must contain at least one lowercase letter";
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = "Password must contain at least one uppercase letter";
        } else if (!/(?=.*\d)/.test(value)) {
          error = "Password must contain at least one number";
        } else if (!/(?=.*[!@#$%^&*])/.test(value)) {
          error =
            "Password must contain at least one special character (!@#$%^&*)";
        }
        break;

      case "phone":
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (!/^\d{10}$/.test(value)) {
          error = "Please enter a valid 10-digit phone number";
        }
        break;

      case "gender":
        if (!value) {
          error = "Please select your gender";
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Validate all form fields
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (key === "address") return; // Address is optional

      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing again
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Validate on-the-fly for better UX
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Handle input blur for validation
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "", color: "gray.300" };

    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*]/.test(password)) strength += 1;

    const strengthMap = {
      1: { text: "Very Weak", color: "red.500" },
      2: { text: "Weak", color: "orange.500" },
      3: { text: "Moderate", color: "yellow.500" },
      4: { text: "Strong", color: "green.500" },
      5: { text: "Very Strong", color: "green.600" },
    };

    return {
      strength,
      ...strengthMap[strength],
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched for validation
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate all fields before submission
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = document.querySelector(".error-field");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
        firstErrorField.focus();
      }
      return;
    }

    const result = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(result)) {
      notification.success({
        message: "Registration Successful",
        description:
          result?.payload?.message ||
          "Your account has been created successfully!",
        duration: 3,
      });
      navigate("/login");
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
    <Flex direction={{ base: "column", md: "row" }} h="100%" w="100%">
      {/* Form Section */}
      <Box
        w={{ base: "100%", md: "50%" }}
        h={{ base: "auto", md: "100%" }}
        p={{ base: 6, md: 8 }}
        overflowY={{ base: "visible", md: "auto" }}
        css={{
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
        }}
      >
        <Stack spacing={6} maxW="500px" mx="auto">
          <Heading size="lg" color="gray.700">
            Create your account
          </Heading>

          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={4}>
              <Grid
                templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }}
                gap={4}
              >
                <FormControl
                  isInvalid={touched.fullName && !!errors.fullName}
                  isRequired
                  className={
                    touched.fullName && !!errors.fullName ? "error-field" : ""
                  }
                >
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    focusBorderColor={
                      touched.fullName && !errors.fullName
                        ? "green.400"
                        : "blue.500"
                    }
                  />
                  <FormErrorMessage>{errors.fullName}</FormErrorMessage>
                  {touched.fullName && !errors.fullName && (
                    <FormHelperText color="green.500">
                      <Icon as={CheckIcon} mr={1} />
                      Looks good
                    </FormHelperText>
                  )}
                </FormControl>

                <FormControl
                  isInvalid={touched.userName && !!errors.userName}
                  isRequired
                  className={
                    touched.userName && !!errors.userName ? "error-field" : ""
                  }
                >
                  <FormLabel>Username</FormLabel>
                  <Input
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    focusBorderColor={
                      touched.userName && !errors.userName
                        ? "green.400"
                        : "blue.500"
                    }
                  />
                  <FormErrorMessage>{errors.userName}</FormErrorMessage>
                  {touched.userName && !errors.userName && (
                    <FormHelperText color="green.500">
                      <Icon as={CheckIcon} mr={1} />
                      Username available
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid
                templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }}
                gap={4}
              >
                <FormControl
                  isInvalid={touched.phone && !!errors.phone}
                  isRequired
                  className={
                    touched.phone && !!errors.phone ? "error-field" : ""
                  }
                >
                  <FormLabel>Phone</FormLabel>
                  <InputGroup>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={10}
                      pattern="\d{10}"
                      focusBorderColor={
                        touched.phone && !errors.phone
                          ? "green.400"
                          : "blue.500"
                      }
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.phone}</FormErrorMessage>
                </FormControl>

                <FormControl
                  isInvalid={touched.gender && !!errors.gender}
                  isRequired
                  className={
                    touched.gender && !!errors.gender ? "error-field" : ""
                  }
                >
                  <FormLabel>Gender</FormLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Select gender"
                    focusBorderColor={
                      touched.gender && !errors.gender
                        ? "green.400"
                        : "blue.500"
                    }
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Select>
                  <FormErrorMessage>{errors.gender}</FormErrorMessage>
                </FormControl>
              </Grid>

              <Grid
                templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }}
                gap={4}
              >
                <FormControl
                  isInvalid={touched.email && !!errors.email}
                  isRequired
                  className={
                    touched.email && !!errors.email ? "error-field" : ""
                  }
                >
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    focusBorderColor={
                      touched.email && !errors.email ? "green.400" : "blue.500"
                    }
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl
                  isInvalid={touched.password && !!errors.password}
                  isRequired
                  className={
                    touched.password && !!errors.password ? "error-field" : ""
                  }
                >
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="••••••••"
                      focusBorderColor={
                        touched.password && !errors.password
                          ? "green.400"
                          : "blue.500"
                      }
                    />
                    <InputRightElement>
                      <PasswordToggle
                        showPassword={showPassword}
                        togglePasswordVisibility={() =>
                          setShowPassword(!showPassword)
                        }
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                  {touched.password && formData.password && (
                    <Box mt={2}>
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        Password strength: {passwordStrength.text}
                      </Text>
                      <Box h="3px" w="100%" bg="gray.200" borderRadius="full">
                        <Box
                          h="100%"
                          w={`${(passwordStrength.strength / 5) * 100}%`}
                          bg={passwordStrength.color}
                          borderRadius="full"
                          transition="all 0.3s ease"
                        />
                      </Box>
                    </Box>
                  )}
                </FormControl>
              </Grid>

              <FormControl>
                <FormLabel>Address</FormLabel>
                <Textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  resize="vertical"
                />
              </FormControl>

              <Button
                type="submit"
                bg="#00A9FF"
                color="white"
                size="lg"
                isLoading={isLoading}
                loadingText="Creating account..."
                mt={4}
                w="100%"
                _hover={{
                  bg: "#007BB5",
                  transform: "scale(1.02)",
                }}
                transition="all 0.2s"
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

      {/* Image Section */}
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
  );
};

export default RegisterPage;
