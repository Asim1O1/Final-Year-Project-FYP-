import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Flex,
  Button,
  HStack,
  Progress,
  Avatar,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { Calendar, MapPin, Users, Building, Check, Clock } from "lucide-react";
import { fetchSingleCampaign } from "../../features/campaign/campaignSlice";
import { useDispatch, useSelector } from "react-redux";
import { notification } from "antd";
import { volunteerForCampaign } from "../../features/campaign/campaignSlice";
import { VolunteerRequestButton } from "./VolunteerUtil";

const CampaignDetails = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const campaign = useSelector((state) => state?.campaignSlice?.campaign?.data);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchSingleCampaign(id))
      .unwrap()
      .catch(() => {
        notification.error({
          title: "Error",
          description: "Failed to load campaign details",
          status: "error",
        });
      })
      .finally(() => setLoading(false));
  }, [dispatch, id]);

  if (loading) {
    return (
      <Box className="p-4">
        <Progress size="xs" isIndeterminate colorScheme="blue" />
        <Text className="mt-4 text-center text-gray-600">
          Loading campaign details...
        </Text>
      </Box>
    );
  }

  if (!campaign) {
    return (
      <Box className="p-8 text-center">
        <Text className="text-xl text-gray-700">Campaign not found</Text>
      </Box>
    );
  }

  const campaignDate = new Date(campaign.date);
  const isFuture = campaignDate > new Date();
  const formattedDate = campaignDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const volunteerSlotsAvailable =
    campaign.maxVolunteers - campaign?.volunteers?.length;
  const volunteerPercentage =
    campaign.maxVolunteers > 0
      ? Math.round((campaign.volunteers.length / campaign.maxVolunteers) * 100)
      : 0;

  return (
    <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 6 }} py={8}>
      <Box
        bg="white"
        borderRadius="xl"
        boxShadow="md"
        overflow="hidden"
        border="1px solid"
        borderColor="gray.100"
      >
        <Box className="py-6 px-6">
          {/* Campaign header */}
          <Flex
            justify="space-between"
            align="center"
            className="mb-8"
            direction={{ base: "column", sm: "row" }}
            gap={{ base: 4, sm: 0 }}
          >
            <Box>
              <HStack spacing={3} className="mb-3">
                <Badge
                  colorScheme={isFuture ? "green" : "red"}
                  className="px-3 py-1 rounded-full font-medium"
                >
                  {isFuture ? "UPCOMING" : "PAST"}
                </Badge>
              </HStack>
              <Heading size="lg" className="text-gray-800">
                {campaign.title}
              </Heading>
              <Text className="text-gray-600 mt-2 flex items-center gap-2">
                <Calendar size={16} className="text-blue-500" />
                {formattedDate}
              </Text>
            </Box>
            <HStack>
              {/* Add the VolunteerRequestButton here */}
              {campaign.allowVolunteers && (
                <VolunteerRequestButton campaign={campaign} />
              )}
            </HStack>
          </Flex>

          <Text className="mb-8 text-gray-700">{campaign.description}</Text>

          {/* Key info cards */}
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3 }}
            spacing={{ base: 4, md: 6 }}
            className="mb-8"
          >
            <Card
              variant="outline"
              borderColor="gray.200"
              transition="all 0.2s"
              _hover={{ boxShadow: "md", borderColor: "gray.300" }}
            >
              <CardBody className="p-5">
                <Flex align="center">
                  <Box className="mr-4 p-3 bg-blue-100 rounded-full">
                    <MapPin className="text-blue-600" size={20} />
                  </Box>
                  <Box>
                    <Text className="text-sm text-gray-500 font-medium">
                      Location
                    </Text>
                    <Text className="font-medium text-gray-800">
                      {campaign.location}
                    </Text>
                  </Box>
                </Flex>
              </CardBody>
            </Card>

            <Card
              variant="outline"
              borderColor="gray.200"
              transition="all 0.2s"
              _hover={{ boxShadow: "md", borderColor: "gray.300" }}
            >
              <CardBody className="p-5">
                <Flex align="center">
                  <Box className="mr-4 p-3 bg-green-100 rounded-full">
                    <Building className="text-green-600" size={20} />
                  </Box>
                  <Box>
                    <Text className="text-sm text-gray-500 font-medium">
                      Hospital
                    </Text>
                    <Text className="font-medium text-gray-800">
                      {campaign.hospital?.name}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      {campaign.hospital?.address}
                    </Text>
                  </Box>
                </Flex>
              </CardBody>
            </Card>

            {campaign.allowVolunteers && (
              <Card
                variant="outline"
                borderColor="gray.200"
                transition="all 0.2s"
                _hover={{ boxShadow: "md", borderColor: "gray.300" }}
              >
                <CardBody className="p-5">
                  <Flex align="center">
                    <Box className="mr-4 p-3 bg-purple-100 rounded-full">
                      <Users className="text-purple-600" size={20} />
                    </Box>
                    <Box width="100%">
                      <Flex justify="space-between">
                        <Text className="text-sm text-gray-500 font-medium">
                          Volunteers
                        </Text>
                        <Text className="text-sm font-medium text-purple-700">
                          {campaign.volunteers.length}/{campaign.maxVolunteers}
                        </Text>
                      </Flex>
                      <Progress
                        value={volunteerPercentage}
                        colorScheme="purple"
                        size="sm"
                        className="mt-2 rounded-full"
                        hasStripe={volunteerPercentage < 100}
                      />
                      <Text className="text-xs text-gray-500 mt-2">
                        {volunteerSlotsAvailable > 0
                          ? `${volunteerSlotsAvailable} slots available`
                          : "No slots available"}
                      </Text>
                    </Box>
                  </Flex>
                </CardBody>
              </Card>
            )}
          </SimpleGrid>

          {/* Tabs for detailed information */}
          <Tabs colorScheme="blue" variant="soft-rounded" size="md" isLazy>
            <TabList mb={4} gap={2}>
              <Tab
                _selected={{ color: "blue.600", bg: "blue.50" }}
                fontWeight="medium"
              >
                Details
              </Tab>
              <Tab
                _selected={{ color: "blue.600", bg: "blue.50" }}
                fontWeight="medium"
              >
                Volunteers
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Card variant="outline" borderColor="gray.200">
                    <CardHeader
                      bg="gray.50"
                      py={3}
                      px={5}
                      borderBottomWidth="1px"
                    >
                      <Heading size="sm">Campaign Information</Heading>
                    </CardHeader>
                    <CardBody p={5}>
                      <Box mb={5}>
                        <Text className="text-sm font-medium text-gray-500 mb-2">
                          Created By
                        </Text>
                        <Flex align="center">
                          <Avatar size="sm" mr={3} />
                          <Box>
                            <Text fontWeight="medium">
                              {campaign.createdBy?.name}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {campaign.createdBy?.email}
                            </Text>
                          </Box>
                        </Flex>
                      </Box>

                      <Box mb={5}>
                        <Text className="text-sm font-medium text-gray-500 mb-2">
                          Date Created
                        </Text>
                        <Text>
                          {new Date(campaign.createdAt).toLocaleDateString()}
                        </Text>
                      </Box>

                      <Box>
                        <Text className="text-sm font-medium text-gray-500 mb-2">
                          Last Updated
                        </Text>
                        <Text>
                          {new Date(campaign.updatedAt).toLocaleDateString()}
                        </Text>
                      </Box>
                    </CardBody>
                  </Card>

                  <Card variant="outline" borderColor="gray.200">
                    <CardHeader
                      bg="gray.50"
                      py={3}
                      px={5}
                      borderBottomWidth="1px"
                    >
                      <Heading size="sm">Hospital Details</Heading>
                    </CardHeader>
                    <CardBody p={5}>
                      <Box mb={5}>
                        <Text className="text-sm font-medium text-gray-500 mb-2">
                          Name
                        </Text>
                        <Text fontWeight="medium">
                          {campaign.hospital?.name}
                        </Text>
                      </Box>

                      <Box>
                        <Text className="text-sm font-medium text-gray-500 mb-2">
                          Address
                        </Text>
                        <Text>{campaign.hospital?.address}</Text>
                      </Box>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </TabPanel>

              <TabPanel px={0}>
                <Card variant="outline" borderColor="gray.200">
                  <CardHeader
                    bg="gray.50"
                    py={3}
                    px={5}
                    borderBottomWidth="1px"
                  >
                    <Heading size="sm" display="flex" alignItems="center">
                      <Users size={18} className="mr-2" />
                      Volunteers ({campaign?.volunteers?.length})
                    </Heading>
                  </CardHeader>
                  <CardBody p={5}>
                    {campaign.volunteers.length > 0 ? (
                      <List spacing={4}>
                        {campaign.volunteers.map((volunteer) => (
                          <ListItem
                            key={volunteer._id}
                            p={3}
                            borderBottom="1px"
                            borderColor="gray.100"
                            _last={{ borderBottom: "none" }}
                          >
                            <Flex align="center">
                              <ListIcon as={Check} color="green.500" />
                              <Avatar size="sm" mr={3} />
                              <Box>
                                <Text fontWeight="medium">
                                  {volunteer.name}
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                  {volunteer.email}
                                </Text>
                              </Box>
                            </Flex>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Box
                        textAlign="center"
                        py={8}
                        bg="gray.50"
                        borderRadius="md"
                      >
                        <Text color="gray.500">
                          No volunteers have joined this campaign yet.
                        </Text>
                      </Box>
                    )}
                  </CardBody>
                </Card>
              </TabPanel>

              {campaign.allowVolunteers && (
                <TabPanel px={0}>
                  <Card variant="outline" borderColor="gray.200">
                    <CardHeader
                      bg="gray.50"
                      py={3}
                      px={5}
                      borderBottomWidth="1px"
                    >
                      <Heading size="sm" display="flex" alignItems="center">
                        <Clock size={18} className="mr-2" />
                        Volunteer Requests ({campaign.volunteerRequests.length})
                      </Heading>
                    </CardHeader>
                    <CardBody p={5}>
                      {campaign.volunteerRequests.length > 0 ? (
                        <List spacing={4}>
                          {campaign.volunteerRequests.map((request) => (
                            <ListItem
                              key={request._id || request.user}
                              p={4}
                              borderRadius="md"
                              border="1px"
                              borderColor="gray.200"
                              shadow="sm"
                              _hover={{ shadow: "md" }}
                              transition="all 0.2s"
                            >
                              <Flex
                                align="center"
                                justify="space-between"
                                direction={{ base: "column", md: "row" }}
                                gap={{ base: 4, md: 0 }}
                              >
                                <Flex align="center">
                                  <Avatar size="sm" mr={3} />
                                  <Box>
                                    <Text fontWeight="medium">
                                      {request.user?.name || "User"}
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                      {request.user?.email}
                                    </Text>
                                    <Flex
                                      align="center"
                                      fontSize="xs"
                                      color="gray.500"
                                      mt={1}
                                    >
                                      <Clock size={12} className="mr-1" />
                                      <Text>
                                        Requested:{" "}
                                        {new Date(
                                          request.requestedAt
                                        ).toLocaleDateString()}
                                      </Text>
                                    </Flex>
                                  </Box>
                                </Flex>
                                <HStack spacing={2}>
                                  <Badge
                                    colorScheme={
                                      request.status === "approved"
                                        ? "green"
                                        : request.status === "rejected"
                                        ? "red"
                                        : "yellow"
                                    }
                                    borderRadius="full"
                                    px={3}
                                    py={1}
                                  >
                                    {request.status.toUpperCase()}
                                  </Badge>
                                  {request.status === "pending" && (
                                    <>
                                      <Button
                                        size="sm"
                                        colorScheme="green"
                                        borderRadius="full"
                                      >
                                        Approve
                                      </Button>
                                      <Button
                                        size="sm"
                                        colorScheme="red"
                                        borderRadius="full"
                                      >
                                        Reject
                                      </Button>
                                    </>
                                  )}
                                </HStack>
                              </Flex>
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Box
                          textAlign="center"
                          py={8}
                          bg="gray.50"
                          borderRadius="md"
                        >
                          <Text color="gray.500">
                            No pending volunteer requests.
                          </Text>
                        </Box>
                      )}
                    </CardBody>
                  </Card>
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </Box>
  );
};

export default CampaignDetails;
