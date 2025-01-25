import { Box, Button, Icon } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";

import PartnersSection from "../../component/sections/PartnerSection";
import DoctorSection from "../../component/sections/DoctorSection";
import Footer from "../../component/layout/Footer";
import ServiceSection from "../../component/sections/ServiceSection";
import HeroSection from "../../component/sections/HeroSection";

const HomePage = () => {
  const [showGoToTop, setShowGoToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowGoToTop(true);
      } else {
        setShowGoToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Box position="relative">
      <HeroSection />
      <ServiceSection />
      <PartnersSection />
      <DoctorSection />
      <Footer />

      {showGoToTop && (
        <Button
          position="fixed"
          bottom="4"
          right="4"
          size="lg"
          colorScheme="blue"
          borderRadius="full"
          onClick={scrollToTop}
          zIndex="1000"
          shadow="md"
        >
          <Icon as={ArrowUpIcon} boxSize="5" />
        </Button>
      )}
    </Box>
  );
};

export default HomePage;
