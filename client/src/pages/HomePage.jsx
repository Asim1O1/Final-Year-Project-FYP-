import { Box } from "@chakra-ui/react";
import HeroSection from "../component/sections/HeroSection";
import PartnersSection from "../component/sections/PartnerSection";
import DoctorSection from "../component/sections/DoctorSection";
import Footer from "../component/layout/Footer";
import ServiceSection from "../component/sections/ServiceSection";
const HomePage = () => {
  return (
    <Box>
      <HeroSection />
      <ServiceSection />
      <PartnersSection />
      <DoctorSection />
      <Footer />
    </Box>
  );
};

export default HomePage;
