import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  useDisclosure,
  Text,
  Stack,
  Badge,
  HStack,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { Plus, Bell, Calendar, Filter } from "lucide-react";
import { Input, DatePicker, Select } from "antd";

import { useDispatch, useSelector } from "react-redux";
import CampaignList from "../../component/hospital_admin/campaign/CampaignList";
import AddCampaignForm from "../../component/hospital_admin/campaign/AddCampaign";
import UpdateCampaignForm from "../../component/hospital_admin/campaign/UpdateCampaign";
import { fetchAllCampaigns } from "../../features/campaign/campaignSlice";
import { fetchAllHospitals } from "../../features/hospital/hospitalSlice";

const CampaignManagement = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useDisclosure();

  // Get data from Redux store
  const {
    campaigns,
    loading: campaignsLoading,
    error: campaignsError,
  } = useSelector((state) => state?.campaignSlice);
  const {
    hospitals,
    loading: hospitalsLoading,
    error: hospitalsError,
  } = useSelector((state) => state?.hospitalSlice?.hospitals);

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const [locationFilter, setLocationFilter] = useState("");
  const [hospitalFilter, setHospitalFilter] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [userRole, setUserRole] = useState("hospital_admin");

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchAllCampaigns());
    dispatch(fetchAllHospitals());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (campaignsError) {
      toast({
        title: "Error loading campaigns",
        description: campaignsError,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    if (hospitalsError) {
      toast({
        title: "Error loading hospitals",
        description: hospitalsError,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [campaignsError, hospitalsError, toast]);

  // Format hospitals for filter dropdown

  console.log("the hispitals are", hospitals);
  const hospitalOptions =
    hospitals?.map((hospital) => ({
      value: hospital._id,
      label: hospital.name,
    })) || [];



  // Handle opening the form for adding a new campaign
  const handleAddCampaign = () => {
    setSelectedCampaign(null);
    onAddOpen();
  };

  // Handle opening the form for editing an existing campaign
  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    onUpdateOpen();
  };

  // Handle deleting a campaign
  const handleDeleteCampaign = (campaignId) => {
    // This should be replaced with actual delete dispatch
    // dispatch(deleteCampaign(campaignId));
    toast({
      title: "Campaign deleted",
      description: "The campaign has been deleted successfully.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle date filter change
  const handleDateFilterChange = (date, dateString) => {
    setDateFilter(dateString);
  };

  // Handle location filter change
  const handleLocationFilterChange = (e) => {
    setLocationFilter(e.target.value);
  };

  // Handle hospital filter change
  const handleHospitalFilterChange = (value) => {
    setHospitalFilter(value);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setDateFilter(null);
    setLocationFilter("");
    setHospitalFilter("");
  };

  // Filter campaigns based on search query and filters
  const filteredCampaigns =
    campaigns?.filter((campaign) => {
      const matchesSearch =
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        campaign.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDate = dateFilter ? campaign.date === dateFilter : true;
      const matchesLocation = locationFilter
        ? campaign.location.toLowerCase().includes(locationFilter.toLowerCase())
        : true;
      const matchesHospital = hospitalFilter
        ? campaign.hospital === hospitalFilter
        : true;

      return matchesSearch && matchesDate && matchesLocation && matchesHospital;
    }) || [];

  // Get unread notifications count
  const unreadNotificationsCount = notifications.filter(
    (n) => !n.isRead
  ).length;

  return (
    <Container maxW="container.xl" py={6}>
      {/* Header Section */}
      <Flex justify="space-between" align="center" mb={6}>
        <Stack spacing={1}>
          <Heading size="lg">Campaign Management</Heading>
          <Text color="gray.600">
            {filteredCampaigns.length} campaigns found
          </Text>
        </Stack>
        <HStack spacing={4}>
          <Box position="relative">
            <Button variant="ghost" aria-label="Notifications">
              <Icon as={Bell} boxSize={6} />
              {unreadNotificationsCount > 0 && (
                <Badge
                  colorScheme="red"
                  borderRadius="full"
                  position="absolute"
                  top="-2px"
                  right="-2px"
                >
                  {unreadNotificationsCount}
                </Badge>
              )}
            </Button>
          </Box>
          {userRole === "hospital_admin" && (
            <Button
              colorScheme="blue"
              leftIcon={<Plus size={20} />}
              onClick={handleAddCampaign}
            >
              Create New Campaign
            </Button>
          )}
        </HStack>
      </Flex>

      {/* Main Content */}
      <Flex gap={6} direction={{ base: "column", lg: "row" }}>
        <Box flex="1">
          {/* Search & Filter Section */}
          <Box mb={6} p={4} borderWidth="1px" borderRadius="md" bg="white">
            <Stack spacing={4}>
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={handleSearchChange}
                allowClear
              />
              <Flex gap={4} flexWrap="wrap">
                <Box flex={{ base: "1 0 100%", md: "1" }}>
                  <DatePicker
                    placeholder="Filter by date"
                    onChange={handleDateFilterChange}
                    style={{ width: "100%" }}
                  />
                </Box>
                <Box flex={{ base: "1 0 100%", md: "1" }}>
                  <Input
                    placeholder="Filter by location"
                    value={locationFilter}
                    onChange={handleLocationFilterChange}
                    allowClear
                  />
                </Box>
                <Box flex={{ base: "1 0 100%", md: "1" }}>
                  <Select
                    placeholder="Filter by hospital"
                    style={{ width: "100%" }}
                    options={hospitalOptions}
                    value={hospitalFilter || undefined}
                    onChange={handleHospitalFilterChange}
                    allowClear
                    loading={hospitalsLoading}
                  />
                </Box>
              </Flex>
              <Flex justify="flex-end">
                <Button
                  leftIcon={<Filter size={16} />}
                  variant="outline"
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </Button>
              </Flex>
            </Stack>
          </Box>

          {/* Campaign List */}
          <CampaignList
            campaigns={filteredCampaigns}
            isLoading={campaignsLoading}
            userRole={userRole}
            onEdit={handleEditCampaign}
            onDelete={handleDeleteCampaign}
          />
        </Box>

        {/* Upcoming Events Sidebar */}
        <Box width={{ base: "100%", lg: "300px" }} flexShrink={0}>
          <Box
            p={4}
            borderWidth="1px"
            borderRadius="md"
            bg="white"
            position={{ lg: "sticky" }}
            top={{ lg: "20px" }}
          >
            <Flex align="center" mb={4}>
              <Icon as={Calendar} mr={2} />
              <Heading size="md">Upcoming Events</Heading>
            </Flex>
            {/* <UpcomingEvents campaigns={campaigns} /> */}
          </Box>
        </Box>
      </Flex>

      {/* Add Campaign Modal */}
      <AddCampaignForm
        isOpen={isAddOpen}
        onClose={onAddClose}
        hospitals={hospitalOptions}
      />

      {/* Update Campaign Modal */}
      <UpdateCampaignForm
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
        campaignData={selectedCampaign}
        hospitals={hospitalOptions}
      />
    </Container>
  );
};

export default CampaignManagement;
