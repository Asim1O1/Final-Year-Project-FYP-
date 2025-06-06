import { CalendarIcon, CheckCircleIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  List,
  ListIcon,
  ListItem,
  Progress,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { notification } from "antd";
import {
  BuildingIcon,
  Clock1Icon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSingleCampaign } from "../../features/campaign/campaignSlice";
import { VolunteerRequestButton } from "./VolunteerUtil";

const CampaignDetails = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const campaign = useSelector((state) => state?.campaignSlice?.campaign?.data);

  // Colors
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const headerBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");

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
    <Box bg={bgColor} minH="100vh" py={10}>
      <Container maxW="container.xl">
        <Box
          bg={cardBg}
          borderRadius="xl"
          boxShadow="md"
          overflow="hidden"
          border="1px solid"
          borderColor={borderColor}
        >
          <Box p={{ base: 4, md: 6 }}>
            {/* Campaign header */}
            <Flex
              justify="space-between"
              align={{ base: "start", md: "center" }}
              mb={8}
              direction={{ base: "column", md: "row" }}
              gap={{ base: 4, md: 0 }}
            >
              <Box>
                <HStack spacing={3} mb={3}>
                  <Badge
                    colorScheme={isFuture ? "green" : "red"}
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontWeight="medium"
                  >
                    {isFuture ? "UPCOMING" : "PAST"}
                  </Badge>
                  {campaign.isActive ? (
                    <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
                      ACTIVE
                    </Badge>
                  ) : (
                    <Badge colorScheme="gray" px={3} py={1} borderRadius="full">
                      INACTIVE
                    </Badge>
                  )}
                </HStack>
                <Heading size="lg" color="gray.800">
                  {campaign.title}
                </Heading>
                <HStack spacing={4} mt={2}>
                  <Flex align="center" color={textColor}>
                    <CalendarIcon size={16} className="mr-2 text-teal-500" />
                    <Text>{formattedDate}</Text>
                  </Flex>
                  <Flex align="center" color={textColor}>
                    <MapPinIcon size={16} className="mr-2 text-teal-500" />
                    <Text>{campaign.location}</Text>
                  </Flex>
                </HStack>
              </Box>

              {campaign.allowVolunteers && (
                <VolunteerRequestButton campaign={campaign} />
              )}
            </Flex>

            <Text mb={8} color="gray.700" fontSize="md" lineHeight="tall">
              {campaign.description}
            </Text>

            {/* Key info cards */}
            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 3 }}
              spacing={{ base: 4, md: 6 }}
              mb={8}
            >
              <Card
                variant="outline"
                borderColor={borderColor}
                transition="all 0.2s"
                _hover={{ boxShadow: "md", borderColor: "gray.300" }}
              >
                <CardBody p={5}>
                  <Flex align="center">
                    <Box mr={4} p={3} bg="teal.50" borderRadius="full">
                      <MapPinIcon className="text-teal-600" size={20} />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500" fontWeight="medium">
                        Location
                      </Text>
                      <Text fontWeight="medium" color="gray.800">
                        {campaign.location}
                      </Text>
                    </Box>
                  </Flex>
                </CardBody>
              </Card>

              <Card
                variant="outline"
                borderColor={borderColor}
                transition="all 0.2s"
                _hover={{ boxShadow: "md", borderColor: "gray.300" }}
              >
                <CardBody p={5}>
                  <Flex align="center">
                    <Box mr={4} p={3} bg="blue.50" borderRadius="full">
                      <BuildingIcon className="text-blue-600" size={20} />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500" fontWeight="medium">
                        Hospital
                      </Text>
                      <Text fontWeight="medium" color="gray.800">
                        {campaign.hospital?.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        {campaign.hospital?.location}
                      </Text>
                    </Box>
                  </Flex>
                </CardBody>
              </Card>

              {campaign.allowVolunteers && (
                <Card
                  variant="outline"
                  borderColor={borderColor}
                  transition="all 0.2s"
                  _hover={{ boxShadow: "md", borderColor: "gray.300" }}
                >
                  <CardBody p={5}>
                    <Flex align="center">
                      <Box mr={4} p={3} bg="purple.50" borderRadius="full">
                        <UsersIcon className="text-purple-600" size={20} />
                      </Box>
                      <Box width="100%">
                        <Flex justify="space-between">
                          <Text
                            fontSize="sm"
                            color="gray.500"
                            fontWeight="medium"
                          >
                            Volunteers
                          </Text>
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color="purple.700"
                          >
                            {campaign.volunteers.length}/
                            {campaign.maxVolunteers}
                          </Text>
                        </Flex>

                        {isFuture && (
                          <Progress
                            value={volunteerPercentage}
                            colorScheme="purple"
                            size="sm"
                            mt={2}
                            borderRadius="full"
                            hasStripe={volunteerPercentage < 100}
                          />
                        )}

                        <Text
                          fontSize="xs"
                          color="gray.500"
                          mt={2}
                          fontWeight={!isFuture ? "medium" : "normal"}
                        >
                          {!isFuture
                            ? "Campaign has ended - no longer accepting volunteers"
                            : volunteerSlotsAvailable > 0
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
            <Tabs colorScheme="teal" variant="soft-rounded" size="md" isLazy>
              <TabList mb={4} gap={2} overflowX="auto" py={2}>
                <Tab
                  _selected={{ color: "teal.600", bg: "teal.50" }}
                  fontWeight="medium"
                >
                  Details
                </Tab>
                <Tab
                  _selected={{ color: "teal.600", bg: "teal.50" }}
                  fontWeight="medium"
                >
                  Volunteers ({campaign.volunteers.length})
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel px={0}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <Card variant="outline" borderColor={borderColor}>
                      <CardHeader
                        bg={headerBg}
                        py={3}
                        px={5}
                        borderBottomWidth="1px"
                        borderBottomColor={borderColor}
                      >
                        <Heading size="sm">Campaign Information</Heading>
                      </CardHeader>
                      <CardBody p={5}>
                        <VStack align="stretch" spacing={4}>
                          <Box>
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              color="gray.500"
                              mb={2}
                            >
                              Created By
                            </Text>
                            <Flex align="center">
                              <Avatar
                                size="sm"
                                mr={3}
                                name={campaign.createdBy?.fullName}
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  campaign.createdBy?.fullName
                                )}&background=random`}
                              />
                              <Box>
                                <Text fontWeight="medium">
                                  {campaign.createdBy?.fullName}
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                  {campaign.createdBy?.email}
                                </Text>
                              </Box>
                            </Flex>
                          </Box>

                          <Divider />

                          <Box>
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              color="gray.500"
                              mb={2}
                            >
                              Date Created
                            </Text>
                            <Flex align="center">
                              <Clock1Icon
                                size={16}
                                className="mr-2 text-gray-400"
                              />
                              <Text>
                                {new Date(
                                  campaign.createdAt
                                ).toLocaleDateString()}
                              </Text>
                            </Flex>
                          </Box>

                          <Divider />

                          <Box>
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              color="gray.500"
                              mb={2}
                            >
                              Last Updated
                            </Text>
                            <Flex align="center">
                              <ClockIcon
                                size={16}
                                className="mr-2 text-gray-400"
                              />
                              <Text>
                                {new Date(
                                  campaign.updatedAt
                                ).toLocaleDateString()}
                              </Text>
                            </Flex>
                          </Box>
                        </VStack>
                      </CardBody>
                    </Card>

                    <Card variant="outline" borderColor={borderColor}>
                      <CardHeader
                        bg={headerBg}
                        py={3}
                        px={5}
                        borderBottomWidth="1px"
                        borderBottomColor={borderColor}
                      >
                        <Heading size="sm">Hospital Details</Heading>
                      </CardHeader>
                      <CardBody p={5}>
                        <VStack align="stretch" spacing={4}>
                          <Box>
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              color="gray.500"
                              mb={2}
                            >
                              Name
                            </Text>
                            <Text fontWeight="medium">
                              {campaign.hospital?.name}
                            </Text>
                          </Box>

                          <Divider />

                          <Box>
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              color="gray.500"
                              mb={2}
                            >
                              Address
                            </Text>
                            <Text>
                              {campaign.hospital?.address ||
                                "Address not available"}
                            </Text>
                          </Box>
                        </VStack>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                </TabPanel>

                <TabPanel px={0}>
                  <Card variant="outline" borderColor={borderColor}>
                    <CardHeader
                      bg={headerBg}
                      py={3}
                      px={5}
                      borderBottomWidth="1px"
                      borderBottomColor={borderColor}
                    >
                      <Heading size="sm" display="flex" alignItems="center">
                        <UsersIcon size={18} className="mr-2" />
                        Volunteers ({campaign.volunteers.length})
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
                                <ListIcon
                                  as={CheckCircleIcon}
                                  color="green.500"
                                />
                                <Avatar
                                  size="sm"
                                  mr={3}
                                  name={volunteer.fullName}
                                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    volunteer.fullName
                                  )}&background=random`}
                                />
                                <Box>
                                  <Text fontWeight="medium">
                                    {volunteer.fullName}
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
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CampaignDetails;
