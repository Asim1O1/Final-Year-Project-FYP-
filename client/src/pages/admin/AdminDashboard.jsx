// pages/admin/Dashboard.jsx

import { Box, Grid, Heading } from "@chakra-ui/react";
import { DashboardStats } from "../../component/admin/DashboardStats";
import { RecentActivity } from "../../component/admin/RecentActivity";
import { Notifications } from "../../component/admin/Notifications";

export const AdminDashboard = () => {
  return (
    <Box>
      <Heading mb={6} size="lg">
        Dashboard
      </Heading>
      <DashboardStats />

      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6} mt={8}>
        <Box bg="white" p={6} rounded="lg" shadow="sm">
          <Heading size="md" mb={4}>
            Recent Activity
          </Heading>
          <RecentActivity />
        </Box>

        <Box bg="white" p={6} rounded="lg" shadow="sm">
          <Heading size="md" mb={4}>
            Notifications
          </Heading>
          <Notifications />
        </Box>
      </Grid>
    </Box>
  );
};
