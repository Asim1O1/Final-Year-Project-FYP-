import React from "react";
import { Box, Container, Heading, Text, SimpleGrid, VStack } from "@chakra-ui/react";
import ServiceCard from "../common/ServiceCard";
import { motion } from "framer-motion";

const ServiceSection = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const services = [
    {
      icon: "🏥",
      title: "Primary Care",
      description: "Comprehensive primary healthcare services for your family's wellbeing.",
    },
    {
      icon: "👨‍⚕️",
      title: "Qualified Doctor",
      description: "Expert medical professionals with years of specialized experience.",
    },
    {
      icon: "🚑",
      title: "Emergency Care",
      description: "24/7 emergency medical services with rapid response times.",
    },
    {
      icon: "🏥",
      title: "Operation Theater",
      description: "State-of-the-art surgical facilities with modern equipment.",
    },
  ];

  return (
    <Box py={20} className="bg-gradient-to-b from-blue-50 to-white">
      <Container maxW="container.xl">
        <VStack spacing={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box textAlign="center" className="max-w-2xl mx-auto">
              <Heading 
                mb={4} 
                className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
              >
                Our Services
              </Heading>
              <Text 
                className="text-gray-600 text-lg"
              >
                We are always fully focused on helping your child and you
              </Text>
            </Box>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full cursor-pointer"
          >
            <SimpleGrid 
              columns={{ base: 1, md: 2, lg: 4 }} 
              spacing={8}
              className="w-full"
            >
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                />
              ))}
            </SimpleGrid>
          </motion.div>
        </VStack>
      </Container>
    </Box>
  );
};

export default ServiceSection;