import React from "react";
import {
  Box,
  Grid,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from "@chakra-ui/react";

export const HospitalAdminDashboard = () => {
  const stats = [
    {
      label: "Total Doctors",
      number: "45",
      change: "+5%",
      isIncrease: true,
    },
    {
      label: "Active Appointments",
      number: "128",
      change: "+12%",
      isIncrease: true,
    },
    {
      label: "Medical Tests Today",
      number: "67",
      change: "-3%",
      isIncrease: false,
    },
    {
      label: "Active Campaigns",
      number: "4",
      change: "0%",
      isIncrease: true,
    },
  ];

  return (
    <Box>
      <Heading mb={6} size="lg">
        Hospital Dashboard
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        {stats.map((stat) => (
          <Box key={stat.label} bg="white" p={6} rounded="lg" shadow="sm">
            <Stat>
              <StatLabel>{stat.label}</StatLabel>
              <StatNumber>{stat.number}</StatNumber>
              <StatHelpText>
                <StatArrow type={stat.isIncrease ? "increase" : "decrease"} />
                {stat.change} from last month
              </StatHelpText>
            </Stat>
          </Box>
        ))}
      </SimpleGrid>

      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
        <Box bg="white" p={6} rounded="lg" shadow="sm">
          <Heading size="md" mb={4}>
            Recent Activity
          </Heading>
          {/* Recent Activity Component */}
        </Box>

        <Box bg="white" p={6} rounded="lg" shadow="sm">
          <Heading size="md" mb={4}>
            Notifications
          </Heading>
          {/* Notifications Component */}
        </Box>
      </Grid>
    </Box>
  );
};
