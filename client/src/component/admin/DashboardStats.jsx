import React, { useEffect } from "react";
import {
  SimpleGrid,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  Center,
  Flex,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { handleGetDashboardStats } from "../../features/system_admin/systemadminslice";
import CustomLoader from "../../component/common/CustomSpinner";

export const DashboardStats = () => {
  const dispatch = useDispatch();
  const { stats, isLoading, error } = useSelector(
    (state) => state?.systemAdminSlice
  );

  useEffect(() => {
    dispatch(handleGetDashboardStats());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Flex minH="50vh" align="center" justify="center">
        <Center>
          <CustomLoader
            size="lg"
            primaryColor="indigo"
            secondaryColor="teal"
            text="Loading dashboard stats"
            variant="orbital"
            glassmorphism={true}
          />
        </Center>
      </Flex>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={10} color="red.500">
        <Text fontSize="lg">Failed to load dashboard stats.</Text>
        <Text>{error}</Text>
      </Box>
    );
  }

  if (!stats) return null;

  const statData = [
    {
      label: "Total Hospitals",
      number: stats?.data.totalHospitals || 0,
    },
    {
      label: "Total Doctors",
      number: stats.data?.totalDoctors || 0,
    },
    {
      label: "Total Users",
      number: stats.data.totalUsers || 0,
    },
    {
      label: "Total Hospital Admins",
      number: stats.data.totalHospitalAdmins || 0,
    },
  ];

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
      {statData.map((stat) => (
        <Box key={stat.label} bg="white" p={6} rounded="lg" shadow="sm">
          <Stat>
            <StatLabel color="gray.500">{stat.label}</StatLabel>
            <StatNumber fontSize="3xl">{stat.number}</StatNumber>
          </Stat>
        </Box>
      ))}
    </SimpleGrid>
  );
};
