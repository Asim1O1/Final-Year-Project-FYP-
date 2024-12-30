import { Box, Container, Heading, Text, SimpleGrid, VStack } from "@chakra-ui/react";
import PartnerCard from "../common/PartnerCard";

const PartnersSection = () => (
  <Box py={20} bg="#F8FBFF">
    <Container maxW="container.xl">
      <VStack spacing={12}>
        <Box textAlign="center">
          <Heading color="gray.800" mb={4}>
            Medical Partners
          </Heading>
          <Text color="gray.600">
            See prices and procedures from our medical partners
          </Text>
          <Text color="gray.600">
            All prices include consultation and treatment monitoring
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          <PartnerCard
            image="/api/placeholder/400/300"
            title="Emergency Care"
            description="We focus on ergonomics and meeting you where you work. It's only a keystroke away."
            price={95.48}
            time="15"
          />
          <PartnerCard
            image="/api/placeholder/400/300"
            title="Health Queries"
            description="We focus on ergonomics and meeting you where you work. It's only a keystroke away."
            price={95.48}
            time="15"
          />
          <PartnerCard
            image="/api/placeholder/400/300"
            title="Patient procedures"
            description="We focus on ergonomics and meeting you where you work. It's only a keystroke away."
            price={95.48}
            time="15"
          />
        </SimpleGrid>
      </VStack>
    </Container>
  </Box>
);

export default PartnersSection;