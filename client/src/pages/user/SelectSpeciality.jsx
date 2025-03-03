import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Divider,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import StepIndicator from "../../component/common/StepIndicator";
import { SearchBar } from "../../component/common/SearchBar";
import SpecialtyCard from "../../component/common/SpecialityCard";
import Footer from "../../component/layout/Footer";
import Pagination from "../../utils/Pagination";
import PREDEFINED_SPECIALTIES from "../../../../constants/Specialties";

const specialties = PREDEFINED_SPECIALTIES;

const SelectSpecialty = () => {
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Calculate total number of pages
  const totalPages = Math.ceil(specialties.length / itemsPerPage);

  // Get specialties for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSpecialties = specialties.slice(startIndex, endIndex);

  // Function to handle specialization selection
  const handleSelectSpecialty = (specialization) => {
    console.log("The selected specialization is", specialization);
    navigate(`/book-appointment/select-doctor/${specialization}`);
  };

  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Container maxW="container.lg" py={8}>
        {/* Breadcrumbs for consistent navigation */}
        <Breadcrumb separator={<ChevronRightIcon color="gray.500" />} mb={4}>
          <BreadcrumbItem fontWeight="bold">
            <BreadcrumbLink color="blue.500">Select Specialty</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>Choose Doctor</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>Book Appointment</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>Patient Details</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>Confirmation</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Heading size="md" color="blue.500" mb={6}>
          Choose Medical Specialty
        </Heading>

        <Box mb={8} textAlign="right">
          <Text fontSize="sm" color="gray.500">
            Step 1 of 5
          </Text>
        </Box>

        <StepIndicator currentStep={1} />

        <Box width={{ base: "100%", md: "60%" }} mx="auto" my={6}>
          <SearchBar placeholder="Search specialization..." />
        </Box>

        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6} my={8}>
          {currentSpecialties.map((specialization, index) => (
            <SpecialtyCard
              key={index}
              specialization={specialization}
              onClick={() => handleSelectSpecialty(specialization)}
            />
          ))}
        </SimpleGrid>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Container>
      <Divider />
      <Footer />
    </>
  );
};

export default SelectSpecialty;
