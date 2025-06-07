import { ArrowUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Fade,
  Icon,
  useBreakpointValue,
  useColorModeValue,
  useToken,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useEffect, useState } from "react";

import DoctorSection from "../../component/sections/DoctorSection";
import HeroSection from "../../component/sections/HeroSection";
import PartnersSection from "../../component/sections/PartnerSection";
import ServiceSection from "../../component/sections/ServiceSection";

// Subtle animation for elements
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Subtle healthcare-themed decorative elements
const MedicalDecorative = ({ variant }) => {
  const [blue50, teal50, cyan50] = useToken("colors", [
    "blue.50",
    "teal.50",
    "cyan.50",
  ]);

  if (variant === "hero") {
    return (
      <Box
        position="absolute"
        top={{ base: "10%", md: "15%" }}
        right={{ base: "0", md: "5%" }}
        width={{ base: "150px", md: "300px" }}
        height={{ base: "150px", md: "300px" }}
        borderRadius="full"
        bg={blue50}
        opacity="0.4"
        filter="blur(60px)"
        zIndex="0"
        display={{ base: "none", sm: "block" }}
      />
    );
  }

  if (variant === "services") {
    return (
      <Box
        position="absolute"
        bottom="10%"
        left="5%"
        width={{ base: "100px", md: "200px" }}
        height={{ base: "100px", md: "200px" }}
        borderRadius="full"
        bg={teal50}
        opacity="0.3"
        filter="blur(50px)"
        zIndex="0"
        display={{ base: "none", sm: "block" }}
      />
    );
  }

  if (variant === "doctors") {
    return (
      <Box
        position="absolute"
        top="10%"
        right="5%"
        width={{ base: "120px", md: "250px" }}
        height={{ base: "120px", md: "250px" }}
        borderRadius="full"
        bg={cyan50}
        opacity="0.3"
        filter="blur(40px)"
        zIndex="0"
        display={{ base: "none", sm: "block" }}
      />
    );
  }

  return null;
};

// Clean section separator that's appropriate for healthcare
const SectionSeparator = () => {
  const separatorColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Box
      width="100%"
      maxW="1200px"
      height="1px"
      bg={separatorColor}
      mx="auto"
      opacity="0.6"
    />
  );
};

const HomePage = () => {
  const [showGoToTop, setShowGoToTop] = useState(false);

  // Clean, professional color scheme appropriate for healthcare
  const sectionBg = useColorModeValue("white", "gray.900");
  const altSectionBg = useColorModeValue("gray.50", "gray.800");

  // Responsive adjustments
  const buttonSize = useBreakpointValue({ base: "45px", md: "50px" });
  const buttonIconSize = useBreakpointValue({ base: 5, md: 6 });
  const sectionSpacing = useBreakpointValue({
    base: "50px",
    sm: "60px",
    md: "70px",
    lg: "80px",
  });

  // Animation timing - subtle for healthcare focus
  const sectionAnimationDelay = 0.15;

  // Detect scroll position for the "back to top" button
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 300;
      const isVisible = window.scrollY > scrollThreshold;

      if (isVisible !== showGoToTop) {
        setShowGoToTop(isVisible);
      }
    };

    // Throttle scroll event for performance
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

  // Subtle animation settings appropriate for healthcare
  const pulseAnimation = `${pulse} 4s infinite ease-in-out`;
  const fadeInAnimation = (delay) =>
    `${fadeIn} 0.8s ease-out ${delay}s forwards`;

  return (
    <Box width="100%" overflow="hidden">
      {/* Hero Section */}
      <Box
        as="section"
        position="relative"
        bg={sectionBg}
        overflow="hidden"
        sx={{
          animation: fadeInAnimation(0),
        }}
        id="hero-section"
      >
        <MedicalDecorative variant="hero" />
        <HeroSection />
      </Box>

      <Box py={sectionSpacing / 2}>
        <SectionSeparator />
      </Box>

      {/* Services Section */}
      <Box
        as="section"
        position="relative"
        bg={sectionBg}
        px={{ base: 4, md: 6 }}
        py={sectionSpacing}
        sx={{
          animation: fadeInAnimation(sectionAnimationDelay),
        }}
        id="services-section"
      >
        <MedicalDecorative variant="services" />
        <ServiceSection />
      </Box>

      <Box py={sectionSpacing / 2}>
        <SectionSeparator />
      </Box>

      {/* Partners Section */}
      <Box
        as="section"
        position="relative"
        bg={sectionBg}
        px={{ base: 4, md: 6 }}
        py={sectionSpacing}
        sx={{
          animation: fadeInAnimation(sectionAnimationDelay * 2),
        }}
        id="partners-section"
      >
        <PartnersSection />
      </Box>

      <Box py={sectionSpacing / 2}>
        <SectionSeparator />
      </Box>

      {/* Doctors Section */}
      <Box
        as="section"
        position="relative"
        bg={sectionBg}
        px={{ base: 4, md: 6 }}
        py={sectionSpacing}
        sx={{
          animation: fadeInAnimation(sectionAnimationDelay * 3),
        }}
        id="doctors-section"
        mb={sectionSpacing} // Add bottom margin to create space before footer
      >
        <MedicalDecorative variant="doctors" />
        <DoctorSection />
      </Box>

      {/* Subtle scroll to top button with healthcare-appropriate styling */}
      <Fade
        in={showGoToTop}
        transition={{ enter: { duration: 0.4 }, exit: { duration: 0.3 } }}
      >
        <Button
          position="fixed"
          bottom={{ base: "20px", md: "30px" }}
          right={{ base: "20px", md: "30px" }}
          width={buttonSize}
          height={buttonSize}
          colorScheme="blue"
          bg="white"
          color="blue.600"
          _hover={{
            bg: "blue.50",
            transform: "translateY(-2px)",
            boxShadow: "md",
          }}
          _active={{
            bg: "blue.100",
            transform: "translateY(-1px)",
          }}
          borderRadius="full"
          onClick={scrollToTop}
          zIndex="90"
          boxShadow="0 2px 10px rgba(0, 0, 0, 0.1)"
          animation={showGoToTop ? pulseAnimation : undefined}
          transition="all 0.3s ease"
          display="flex"
          alignItems="center"
          justifyContent="center"
          aria-label="Scroll to top"
          border="1px solid"
          borderColor="gray.200"
        >
          <Icon as={ArrowUpIcon} boxSize={buttonIconSize} />
        </Button>
      </Fade>
    </Box>
  );
};

export default HomePage;
