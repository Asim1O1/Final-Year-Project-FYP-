import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Heading,
  Flex,
  Text,
  Checkbox,
  Stack,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  SimpleGrid,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { SearchBar } from "../../component/common/SearchBar";
import DoctorCard from "../../component/common/DoctorCard";
import { fetchDoctorsBySpecialization } from "../../features/doctor/doctorSlice";
import { useParams } from "react-router-dom";

const SelectDoctor = () => {
  const dispatch = useDispatch();
  const { doctors, loading, error } = useSelector(
    (state) => state?.doctorSlice || {}
  );
  const { specialization } = useParams();

  useEffect(() => {
    if (specialization) {
      dispatch(fetchDoctorsBySpecialization({ specialization }));
    }
  }, [dispatch, specialization]);

  const doctorsList = doctors?.doctors || [];
  const hasDoctors = Array.isArray(doctorsList) && doctorsList.length > 0;

  return (
    <Container maxW="container.lg" py={8}>
      <Breadcrumb separator={<ChevronRightIcon color="gray.500" />} mb={4}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/select-specialty" color="blue.500">
            Select Specialty
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem fontWeight="bold">
          <BreadcrumbLink color="blue.500">Choose Doctor</BreadcrumbLink>
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

      <Heading size="md" color="blue.500" mb={4}>
        Choose Your Doctor - {specialization}
      </Heading>

      <Box mb={8} textAlign="right">
        <Text fontSize="sm" color="gray.500">
          Step 2 of 5
        </Text>
      </Box>

      <Flex direction={{ base: "column", md: "row" }} gap={6}>
        {/* Filters Section */}
        <Box
          w={{ base: "100%", md: "250px" }}
          pr={{ md: 8 }}
          mb={{ base: 6, md: 0 }}
          bg="white"
          p={4}
          borderRadius="lg"
          boxShadow="md"
          borderWidth="1px"
          borderColor="gray.200"
          height="fit-content"
        >
          <Text fontWeight="bold" mb={4} color="blue.600">
            Filters
          </Text>
          <Box mb={6}>
            <Text fontWeight="medium" mb={2} color="gray.700">
              Experience
            </Text>
            <Stack spacing={2}>
              <Checkbox colorScheme="blue">0-5 years</Checkbox>
              <Checkbox colorScheme="blue">5-10 years</Checkbox>
              <Checkbox colorScheme="blue">10+ years</Checkbox>
            </Stack>
          </Box>

          <Box mb={6}>
            <Text fontWeight="medium" mb={2} color="gray.700">
              Consultation Fee
            </Text>
            <Flex justify="space-between" mb={2}>
              <Text fontSize="sm" color="gray.600">
                $0
              </Text>
              <Text fontSize="sm" color="gray.600">
                $500
              </Text>
            </Flex>
            <RangeSlider
              defaultValue={[0, 500]}
              min={0}
              max={500}
              colorScheme="blue"
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
              <RangeSliderThumb index={1} />
            </RangeSlider>
          </Box>
        </Box>

        {/* Doctors List Section */}
        <Box flex="1">
          <Box mb={6}>
            <SearchBar placeholder="Search doctors by name" />
          </Box>

          {loading && (
            <Center py={10}>
              <Spinner size="xl" color="blue.500" thickness="4px" />
            </Center>
          )}

          {error && (
            <Text color="red.500" p={4} bg="red.50" borderRadius="md">
              {error}
            </Text>
          )}

          {!loading && !error && (
            <SimpleGrid columns={1} spacing={6}>
              {hasDoctors ? (
                doctorsList.map((doctor, index) => (
                  <DoctorCard key={index} doctor={doctor} />
                ))
              ) : (
                <Box
                  textAlign="center"
                  p={8}
                  bg="gray.50"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="gray.200"
                >
                  <Text fontSize="lg" color="gray.600">
                    No doctors found for {specialization}.
                  </Text>
                </Box>
              )}
            </SimpleGrid>
          )}
        </Box>
      </Flex>
    </Container>
  );
};

export default SelectDoctor;
