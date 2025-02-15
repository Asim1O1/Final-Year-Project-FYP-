import { useNavigate } from "react-router-dom";
import ImageSection from "./ImageSection";
import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import { Box, Heading, Stack, StackDivider, Text } from "@chakra-ui/react";

const UpdatePassword = () => {
    const [formData, setFormData] = useState({
      password: '',
      confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
  
    const handleSubmit = (e) => {
      e.preventDefault();
      setIsLoading(true);
      // Add your password update logic here
      setTimeout(() => {
        setIsLoading(false);
        navigate('/login');
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
            <StackDivider spacing={6}>
              <Heading size="lg" color="gray.700">
                Update Password
              </Heading>
              <Text color="gray.600">
                Please enter your new password.
              </Text>
  
              <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <InputForm
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    isRequired
                    rightElement={
                      <PasswordToggle
                        showPassword={showPassword}
                        togglePasswordVisibility={() => setShowPassword(!showPassword)}
                      />
                    }
                  />
                  <InputForm
                    label="Confirm Password"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    isRequired
                    rightElement={
                      <PasswordToggle
                        showPassword={showPassword}
                        togglePasswordVisibility={() => setShowPassword(!showPassword)}
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
          <ImageSection imageUrl="/MedConnect avatar.png" />
        </Flex>
      </AuthLayout>
    );
  };

  export default UpdatePassword;