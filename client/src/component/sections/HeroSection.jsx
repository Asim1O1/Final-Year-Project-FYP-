"use client";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Flex,
  Stack,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";

import HeroSectionImage from "../../assets/image-removebg 1.png";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/book-appointment");
  };
  const headingSize = useBreakpointValue({ base: "3xl", sm: "4xl", lg: "5xl" });

  // Colors
  const headingColor = useColorModeValue("gray.900", "white");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const primaryButtonBg = useColorModeValue("#00A9FF", "#38B2FF");
  const primaryButtonHoverBg = useColorModeValue("blue.600", "blue.500");
  const secondaryButtonColor = useColorModeValue("blue.500", "blue.300");
  const secondaryButtonBorderColor = useColorModeValue("blue.500", "blue.300");
  const secondaryButtonHoverBg = useColorModeValue("blue.50", "whiteAlpha.200");

  return (
    <Box minH="100vh" position="relative" overflow="hidden">
      {/* Background gradient */}
      <Box
        position="absolute"
        top="0"
        right="0"
        width="50%"
        height="100%"
        bgGradient="linear(to-br, blue.50, white)"
        opacity="0.7"
        transform="translateX(25%)"
        zIndex="-1"
        display={{ base: "none", lg: "block" }}
      />

      {/* Decorative elements */}
      <Box
        position="absolute"
        top="15%"
        left="5%"
        width="150px"
        height="150px"
        borderRadius="full"
        bg="blue.50"
        opacity="0.4"
        zIndex="-1"
        display={{ base: "none", lg: "block" }}
      />

      {/* Hero Content */}
      <Container
        maxW="container.xl"
        px={4}
        pt={{ base: "18", md: "20" }}
        pb={{ base: "20", md: "32" }}
      >
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={{ base: "12", lg: "16" }}
          align="center"
          justify="space-between"
        >
          {/* Left Column - Text Content */}
          <Box
            textAlign={{ base: "center", lg: "left" }}
            maxW={{ base: "full", lg: "500px" }}
            zIndex="1"
          >
            <Heading
              as="h1"
              fontSize={headingSize}
              fontWeight="bold"
              lineHeight="tight"
              color={headingColor}
              mb={6}
            >
              A Wealth of Experience To Heal And Help You.
            </Heading>

            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color={textColor}
              mb={8}
              lineHeight="tall"
            >
              We are always fully focused on helping your child and you.
            </Text>

            <Stack
              direction={{ base: "column", sm: "row" }}
              spacing={4}
              justify={{ base: "center", lg: "flex-start" }}
            >
              <Button
                bg={primaryButtonBg}
                color="white"
                px={8}
                py={6}
                size="lg"
                fontWeight="medium"
                _hover={{
                  bg: primaryButtonHoverBg,
                  transform: "translateY(-2px)",
                }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.2s"
                boxShadow="md"
                borderRadius="md"
              >
                Learn More
              </Button>

              <Button
                bg="transparent"
                color={secondaryButtonColor}
                px={8}
                py={6}
                size="lg"
                fontWeight="medium"
                border="1px solid"
                borderColor={secondaryButtonBorderColor}
                _hover={{
                  bg: secondaryButtonHoverBg,
                  transform: "translateY(-2px)",
                }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.2s"
                borderRadius="md"
                onClick={handleNavigate}
              >
                Make an Appointment
              </Button>
            </Stack>
          </Box>

          {/* Right Column - Circle Design */}
          <div className="relative flex justify-center lg:block">
            <div className="relative transform lg:translate-y-[30px] lg:translate-x-[25px]">
              <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full border-[20px] sm:border-[30px] lg:border-[40px] border-[#A0E9FF] flex items-center justify-center">
                <img
                  src={HeroSectionImage}
                  alt="Hero Section"
                  className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 object-contain"
                />
              </div>
            </div>
          </div>
        </Flex>
      </Container>
    </Box>
  );
};

export default HeroSection;
