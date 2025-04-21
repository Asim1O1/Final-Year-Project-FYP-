import {
  Box,
  Button,
  Icon,
  useColorModeValue,
  keyframes,
  Fade,
  SimpleGrid,
} from "@chakra-ui/react";
import { ArrowUpIcon, PhoneIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";

import PartnersSection from "../../component/sections/PartnerSection";
import DoctorSection from "../../component/sections/DoctorSection";
import Footer from "../../component/layout/Footer";
import ServiceSection from "../../component/sections/ServiceSection";
import HeroSection from "../../component/sections/HeroSection";

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.9; }
`;

const HomePage = () => {
  const [showGoToTop, setShowGoToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Enhanced color tokens for better visual appeal
  const sectionBg = useColorModeValue("white", "gray.900");
  const altSectionBg = useColorModeValue("gray.50", "gray.800");
  const progressBarColor = useColorModeValue("blue.400", "blue.300");

  useEffect(() => {
    const handleScroll = () => {
      // Optimized scroll detection with threshold
      const scrollThreshold = 300;
      const isVisible = window.scrollY > scrollThreshold;

      if (isVisible !== showGoToTop) {
        setShowGoToTop(isVisible);
      }

      // Calculate scroll progress for indicator
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress =
        totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    // Throttle scroll event for performance optimization
    let timeoutId;
    const throttledScroll = () => {
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          handleScroll();
          timeoutId = null;
        }, 100);
      }
    };

    window.addEventListener("scroll", throttledScroll);

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      clearTimeout(timeoutId);
    };
  }, [showGoToTop]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Professional animation with appropriate timing
  const pulseAnimation = `${pulse} 3s infinite ease-in-out`;

  return (
    <>
      {/* Decorative background elements */}
      <Box
        position="absolute"
        top="0"
        right="0"
        width="60%"
        height="100%"
        bgGradient="linear(to-br, blue.50, purple.50)"
        opacity="0.3"
        transform="translateX(30%) skewX(-12deg)"
        zIndex="0"
        display={{ base: "none", lg: "block" }}
        filter="blur(60px)"
      />

      <Box
        position="absolute"
        top="30%"
        left="-10%"
        width="40%"
        height="60%"
        bgGradient="linear(to-tr, teal.50, blue.50)"
        opacity="0.2"
        transform="rotate(-15deg)"
        zIndex="0"
        display={{ base: "none", lg: "block" }}
        filter="blur(80px)"
        borderRadius="full"
      />

      {/* Main content sections with enhanced spacing and transitions */}
      <Box as="section" bg={sectionBg} position="relative" overflow="hidden">
        <HeroSection />
      </Box>

      <Box
        as="section"
        bg={altSectionBg}
        py={{ base: 16, md: 24 }}
        position="relative"
        overflow="hidden"
        borderTop="1px"
        borderBottom="1px"
        borderColor={useColorModeValue("gray.100", "gray.700")}
      >
        {/* Wave separator at top */}
        <Box
          position="absolute"
          top="-2px"
          left="0"
          width="100%"
          height="80px"
          bg={sectionBg}
          clipPath="polygon(0 0, 100% 0, 100% 100%, 0 70%)"
          zIndex="1"
        />
        <ServiceSection />
      </Box>

      <Box
        as="section"
        bg={sectionBg}
        py={{ base: 16, md: 24 }}
        position="relative"
      >
        <PartnersSection />
      </Box>

      <Box
        as="section"
        bg={altSectionBg}
        py={{ base: 16, md: 24 }}
        position="relative"
        overflow="hidden"
        borderTop="1px"
        borderColor={useColorModeValue("gray.100", "gray.700")}
      >
        {/* Diagonal separator at top */}
        <Box
          position="absolute"
          top="-2px"
          left="0"
          width="100%"
          height="80px"
          bg={sectionBg}
          clipPath="polygon(0 0, 100% 0, 100% 100%, 0 0%)"
          zIndex="1"
        />

        {/* Decorative dots pattern */}
        <Box position="absolute" top="10%" right="5%" opacity="0.1" zIndex="0">
          <SimpleGrid columns={6} spacing={4}>
            {[...Array(36)].map((_, i) => (
              <Box
                key={i}
                w="8px"
                h="8px"
                borderRadius="full"
                bg={useColorModeValue("blue.500", "blue.300")}
              />
            ))}
          </SimpleGrid>
        </Box>

        <DoctorSection />
      </Box>

      {/* Enhanced scroll to top button with professional animation and gradient */}
      <Fade
        in={showGoToTop}
        transition={{ enter: { duration: 0.4 }, exit: { duration: 0.3 } }}
      >
        <Button
          position="fixed"
          bottom={{ base: "8", md: "10" }}
          right={{ base: "8", md: "10" }}
          size="lg"
          colorScheme="blue"
          bgGradient="linear(to-r, blue.400, blue.500)"
          _hover={{
            bgGradient: "linear(to-r, blue.500, blue.600)",
            transform: "translateY(-4px)",
            boxShadow: "xl",
          }}
          _active={{
            bgGradient: "linear(to-r, blue.600, blue.700)",
            transform: "translateY(-2px)",
            boxShadow: "md",
          }}
          borderRadius="full"
          onClick={scrollToTop}
          zIndex="1000"
          boxShadow="0 4px 20px rgba(0, 118, 255, 0.3)"
          animation={showGoToTop ? pulseAnimation : undefined}
          transition="all 0.4s ease"
          width="60px"
          height="60px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          aria-label="Scroll to top"
        >
          <Icon as={ArrowUpIcon} boxSize="6" />
        </Button>
      </Fade>
    </>
  );
};

export default HomePage;
