import React from 'react';
import { SimpleGrid, Box, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';

export const DashboardStats = () => {
  const stats = [
    { label: 'Total Hospitals', number: '234', change: '+12% from last month' },
    { label: 'Total Doctors', number: '1,423', change: '+8% from last month' },
    { label: 'Active Users', number: '15.2k', change: '+23% from last month' },
    { label: 'Pending Approvals', number: '28', change: '5 hospitals, 23 doctors' },
  ];

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
      {stats.map((stat) => (
        <Box key={stat.label} bg="white" p={6} rounded="lg" shadow="sm">
          <Stat>
            <StatLabel color="gray.500">{stat.label}</StatLabel>
            <StatNumber fontSize="3xl">{stat.number}</StatNumber>
            <StatHelpText>{stat.change}</StatHelpText>
          </Stat>
        </Box>
      ))}
    </SimpleGrid>
  );
};