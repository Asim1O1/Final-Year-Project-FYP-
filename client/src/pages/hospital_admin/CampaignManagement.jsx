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
} from "@chakra-ui/react";
import { Plus, Bell, Calendar, Filter } from "lucide-react";
import { Input, DatePicker, Select } from "antd";
import { Link } from "react-router-dom";
import CampaignList from "../../component/hospital_admin/campaign/CampaignList";
import AddCampaignForm from "../../component/hospital_admin/campaign/AddCampaign";
import UpdateCampaignForm from "../../component/hospital_admin/campaign/UpdateCampaign";



const CampaignManagement = () => {
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
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const [locationFilter, setLocationFilter] = useState("");
  const [hospitalFilter, setHospitalFilter] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [userRole, setUserRole] = useState("hospital_admin"); 

  // Static campaign data
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      title: "Free Health Checkup",
      description: "Annual free health checkup for senior citizens",
      date: "2025-03-15",
      location: "Central Park",
      hospital: "City General Hospital",
      createdBy: "admin123",
    },
    {
      id: 2,
      title: "Blood Donation Drive",
      description: "Donate blood and save lives",
      date: "2025-03-20",
      location: "Community Center",
      hospital: "Metro Healthcare",
      createdBy: "admin123",
    },
    {
      id: 3,
      title: "Diabetes Awareness Workshop",
      description: "Learn about diabetes prevention and management",
      date: "2025-04-05",
      location: "Public Library",
      hospital: "City General Hospital",
      createdBy: "admin123",
    },
  ]);

  // Static hospitals data for filter dropdown
  const hospitals = [
    { value: "City General Hospital", label: "City General Hospital" },
    { value: "Metro Healthcare", label: "Metro Healthcare" },
    { value: "Community Medical Center", label: "Community Medical Center" },
  ];

  // Static notification data
  useEffect(() => {
    setNotifications([
      {
        id: 1,
        title: "New Campaign Created",
        message: "Blood Donation Drive has been created",
        isRead: false,
        createdAt: "2025-03-05T10:00:00Z",
      },
      {
        id: 2,
        title: "Campaign Updated",
        message: "Free Health Checkup details have been updated",
        isRead: true,
        createdAt: "2025-03-04T14:30:00Z",
      },
    ]);
  }, []);

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
    setCampaigns(campaigns.filter((campaign) => campaign.id !== campaignId));
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
  const filteredCampaigns = campaigns.filter(
    (campaign) => {
      const matchesSearch = 
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDate = dateFilter ? campaign.date === dateFilter : true;
      const matchesLocation = locationFilter ? 
        campaign.location.toLowerCase().includes(locationFilter.toLowerCase()) : true;
      const matchesHospital = hospitalFilter ? 
        campaign.hospital === hospitalFilter : true;
      
      return matchesSearch && matchesDate && matchesLocation && matchesHospital;
    }
  );

  // Get unread notifications count
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  return (
    <Container maxW="container.xl" py={6}>
      {/* Header Section */}
      <Flex justify="space-between" align="center" mb={6}>
        <Stack spacing={1}>
          <Heading size="lg">Campaign Management</Heading>
          <Text color="gray.600">{campaigns.length} campaigns registered</Text>
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
                    style={{ width: '100%' }}
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
                    style={{ width: '100%' }}
                    options={hospitals}
                    value={hospitalFilter || undefined}
                    onChange={handleHospitalFilterChange}
                    allowClear
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
            isLoading={false}
            userRole={userRole}
            onEdit={handleEditCampaign}
            onDelete={handleDeleteCampaign}
          />
        </Box>

        {/* Upcoming Events Sidebar */}
        <Box 
          width={{ base: "100%", lg: "300px" }} 
          flexShrink={0}
        >
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
        hospitals={hospitals}
      />

      {/* Update Campaign Modal */}
      <UpdateCampaignForm
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
        campaignData={selectedCampaign}
        hospitals={hospitals}
      />
    </Container>
  );
};

export default CampaignManagement;