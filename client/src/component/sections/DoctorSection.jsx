import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import DoctorCard from "../common/DoctorCard";
import DoctorImage from "../../assets/Doctor image.png"

const DoctorSection = () => (
  <Box py={20} bg="#F8FBFF">
    <Container maxW="container.xl">
      <VStack spacing={12}>
        <Box textAlign="center">
          <Text
            color="blue.500"
            fontWeight="medium"
            textTransform="uppercase"
            letterSpacing="wide"
            mb={2}
          >
            TRUSTED CARE
          </Text>
          <Heading color="gray.800">Our Doctors</Heading>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          <DoctorCard
            image={DoctorImage}
            name="Asim Khadka"
            specialty="Neurology"
          />
          <DoctorCard
            image={DoctorImage}
            name="Asim Khadka"
            specialty="Nephrology"
          />
          <DoctorCard
            image={DoctorImage}
            name="Asim Khadka"
            specialty="Cardiology"
          />
        </SimpleGrid>
      </VStack>
    </Container>
  </Box>
);

export default DoctorSection;
