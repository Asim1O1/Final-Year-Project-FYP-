import { Box } from "@chakra-ui/react";
import HeroSection from "../component/sections/HeroSection";
import ServicesSection from "../component/sections/ServiceSection";
import PartnersSection from "../component/sections/PartnerSection";
import DoctorSection from "../component/sections/DoctorSection";
import Footer from "../component/layout/Footer";

const HomePage = () => {
  return (
    <Box>
      <HeroSection />
      <ServicesSection />
      <PartnersSection />
      <DoctorSection />
      <Footer/>
    </Box>
  );
};

export default HomePage;
