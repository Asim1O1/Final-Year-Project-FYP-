import React from "react";
import { Box, Heading, SimpleGrid } from "@chakra-ui/react";

import { HospitalCard } from "../component/common/HospitalCard";
import { TopSection } from "../component/common/TopSection";
import Footer from "../component/layout/Footer";

const mockHospitals = [
  {
    id: 1,
    name: "Central Medical Center",
    address: "123 Healthcare Ave, Medical District",
    image: "/hospital1.jpg",
    rating: 4.8,
    reviews: "2.5k",
    doctorCount: "125",
    specialties: ["Cardiology", "Neurology", "Pediatrics"],
  },
  {
    id: 2,
    name: "Metropolitan Hospital",
    address: "456 Health Street, Medical Park",
    image: "/hospital2.jpg",
    rating: 4.6,
    reviews: "1.8k",
    doctorCount: "98",
    specialties: ["Orthopedics", "Oncology", "Surgery"],
  },
  {
    id: 2,
    name: "Metropolitan Hospital",
    address: "456 Health Street, Medical Park",
    image: "/hospital2.jpg",
    rating: 4.6,
    reviews: "1.8k",
    doctorCount: "98",
    specialties: ["Orthopedics", "Oncology", "Surgery"],
  },
  {
    id: 2,
    name: "Metropolitan Hospital",
    address: "456 Health Street, Medical Park",
    image: "/hospital2.jpg",
    rating: 4.6,
    reviews: "1.8k",
    doctorCount: "98",
    specialties: ["Orthopedics", "Oncology", "Surgery"],
  },
  {
    id: 3,
    name: "City General Hospital",
    address: "789 Care Lane, Wellness Square",
    image: "/hospital3.jpg",
    rating: 4.9,
    reviews: "3.2k",
    doctorCount: "150",
    specialties: ["Emergency", "Maternity", "ICU"],
  },
  {
    id: 3,
    name: "City General Hospital",
    address: "789 Care Lane, Wellness Square",
    image: "/hospital3.jpg",
    rating: 4.9,
    reviews: "3.2k",
    doctorCount: "150",
    specialties: ["Emergency", "Maternity", "ICU"],
  },
];

export const HospitalsPage = () => {
  return (
    <Box className="min-h-screen bg-gray-50">
      <TopSection />

      <Box className="max-w-7xl mx-auto px-4 py-8">
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {mockHospitals.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </SimpleGrid>
      </Box>
      <Footer />
    </Box>
  );
};

export default HospitalsPage;
