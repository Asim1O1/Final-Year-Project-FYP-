// pages/admin/Dashboard.jsx

import { Box, Grid, Heading, useColorModeValue } from "@chakra-ui/react";
import { DashboardStats } from "../../component/admin/DashboardStats";
import { Notifications } from "../../component/admin/Notifications";
import { RecentActivity } from "../../component/admin/RecentActivity";

export const AdminDashboard = () => {
  // Shadow and border for consistent card styling
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const cardShadow = "sm";

  return (
    <Box>
      {/* Dashboard Statistics */}
      <DashboardStats />

      {/* Main Dashboard Grid */}
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6} mt={8}>
        {/* Recent Activity Card */}
        <Box
          bg={cardBg}
          p={6}
          rounded="lg"
          shadow={cardShadow}
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Heading size="md" mb={4}>
            Recent Activity
          </Heading>
          <RecentActivity />
        </Box>

        {/* Notifications Card with Fixed Height and Scrollbar */}
        <Box
          bg={cardBg}
          p={6}
          rounded="lg"
          shadow={cardShadow}
          borderWidth="1px"
          borderColor={borderColor}
          height={{ base: "auto", lg: "500px" }} // Fixed height on desktop
          display="flex"
          flexDirection="column"
        >
          <Heading size="md" mb={4}>
            Notifications
          </Heading>

          {/* Scrollable container for notifications */}
          <Box
            overflowY="auto"
            flex="1"
            css={{
              "&::-webkit-scrollbar": {
                width: "4px",
              },
              "&::-webkit-scrollbar-track": {
                width: "6px",
                background: useColorModeValue("gray.100", "gray.900"),
              },
              "&::-webkit-scrollbar-thumb": {
                background: useColorModeValue("gray.300", "gray.600"),
                borderRadius: "24px",
              },
            }}
          >
            <Notifications />
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
