import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Tag,
  TagLabel,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  HospitalIcon,
  InfoIcon,
  MapPinIcon,
  UserIcon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomLoader from "../../component/common/CustomSpinner";
import { fetchAllCampaigns } from "../../features/campaign/campaignSlice";
import Pagination from "../../utils/Pagination";

// Format date to a readable format
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Calculate volunteer spots remaining
const getVolunteerSpotsRemaining = (campaign) => {
  if (!campaign.allowVolunteers) return 0;
  return campaign.maxVolunteers - (campaign.volunteers?.length || 0);
};

const CampaignCard = ({ campaign }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const badgeBg = useColorModeValue("teal.50", "teal.900");
  const badgeColor = useColorModeValue("#00A9FF", "#38B2FF");

  const isUpcoming = new Date(campaign.date) > new Date();
  const formattedDate = formatDate(campaign.date);
  const spotsRemaining = getVolunteerSpotsRemaining(campaign);

  const handleVolunteer = () => {
    navigate(`/campaigns/${campaign._id}`);
  };

  return (
    <>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg={cardBg}
        borderColor={borderColor}
        boxShadow="sm"
        transition="all 0.3s"
        _hover={{ transform: "translateY(-5px)", boxShadow: "md" }}
        className="hover:shadow-lg"
      >
        <Box p={5}>
          <Flex justify="space-between" align="center" mb={2}>
            <Badge
              px={2}
              py={1}
              bg={isUpcoming ? badgeBg : "gray.100"}
              color={isUpcoming ? badgeColor : "gray.600"}
              borderRadius="full"
            >
              {isUpcoming ? "Upcoming" : "Past"}
            </Badge>
            {campaign.allowVolunteers && (
              <Tag
                size="sm"
                colorScheme={spotsRemaining > 0 ? "green" : "red"}
                borderRadius="full"
              >
                <TagLabel>
                  {spotsRemaining > 0 ? `${spotsRemaining} spots left` : "Full"}
                </TagLabel>
              </Tag>
            )}
          </Flex>

          <Heading as="h3" size="md" mb={2} noOfLines={1}>
            {campaign.title}
          </Heading>

          <Text color={textColor} noOfLines={2} mb={3}>
            {campaign.description}
          </Text>

          <Stack spacing={2} mt={4}>
            <Flex align="center">
              <Icon as={CalendarIcon} color="teal.500" mr={2} />
              <Text fontSize="sm">{formattedDate}</Text>
            </Flex>

            <Flex align="center">
              <Icon as={MapPinIcon} color="teal.500" mr={2} />
              <Text fontSize="sm" noOfLines={1}>
                {campaign.location}
              </Text>
            </Flex>

            <Flex align="center">
              <Icon as={HospitalIcon} color="teal.500" mr={2} />
              <Text fontSize="sm" noOfLines={1}>
                {campaign.hospital.name}
              </Text>
            </Flex>
          </Stack>

          <Divider my={4} />

          <Flex justify="space-between" align="center">
            <Button
              size="sm"
              colorScheme="teal"
              variant="outline"
              onClick={onOpen}
              leftIcon={<InfoIcon size={16} />}
            >
              Details
            </Button>

            {campaign.allowVolunteers && spotsRemaining > 0 && (
              <Button
                onClick={handleVolunteer}
                size="sm"
                colorScheme="teal"
                leftIcon={<UserIcon size={16} />}
              >
                Volunteer
              </Button>
            )}
          </Flex>
        </Box>
      </Box>

      {/* Campaign Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{campaign.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="start" spacing={4}>
              <Box>
                <Heading size="sm" mb={2}>
                  Description
                </Heading>
                <Text>{campaign.description}</Text>
              </Box>

              <Box width="100%">
                <Heading size="sm" mb={2}>
                  Details
                </Heading>
                <SimpleGrid columns={2} spacing={4}>
                  <HStack>
                    <Icon as={CalendarIcon} color="teal.500" />
                    <Text>{formattedDate}</Text>
                  </HStack>

                  <HStack>
                    <Icon as={MapPinIcon} color="teal.500" />
                    <Text>{campaign.location}</Text>
                  </HStack>

                  <HStack>
                    <Icon as={HospitalIcon} color="teal.500" />
                    <Text>{campaign.hospital.name}</Text>
                  </HStack>

                  <HStack>
                    <Icon as={ClockIcon} color="teal.500" />
                    <Text>{isUpcoming ? "Upcoming" : "Past"}</Text>
                  </HStack>
                </SimpleGrid>
              </Box>

              {campaign.allowVolunteers && (
                <Box width="100%">
                  <Heading size="sm" mb={2}>
                    Volunteer Information
                  </Heading>
                  <HStack mb={2}>
                    <Icon as={UsersIcon} color="teal.500" />
                    <Text>
                      {campaign.volunteers.length} of {campaign.maxVolunteers}{" "}
                      volunteers
                    </Text>
                  </HStack>

                  {campaign.volunteers.length > 0 && (
                    <Box mt={2}>
                      <Text fontWeight="medium" mb={1}>
                        Current Volunteers:
                      </Text>
                      <Flex wrap="wrap" gap={2}>
                        {campaign.volunteers.map((volunteer) => (
                          <Tooltip key={volunteer._id} label={volunteer.email}>
                            <Tag
                              size="md"
                              colorScheme="teal"
                              borderRadius="full"
                            >
                              <Avatar
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  volunteer.fullName
                                )}&background=random`}
                                size="xs"
                                mr={2}
                              />
                              <TagLabel>{volunteer.fullName}</TagLabel>
                            </Tag>
                          </Tooltip>
                        ))}
                      </Flex>
                    </Box>
                  )}

                  {campaign.volunteerQuestions.length > 0 && (
                    <Box mt={3}>
                      <Text fontWeight="medium" mb={1}>
                        Volunteer Questions:
                      </Text>
                      <VStack align="start" spacing={1}>
                        {campaign.volunteerQuestions.map((q) => (
                          <HStack key={q._id}>
                            <Icon
                              as={q.isRequired ? CheckCircleIcon : XCircleIcon}
                              color={q.isRequired ? "green.500" : "gray.500"}
                              size={4}
                            />
                            <Text fontSize="sm">{q.question}</Text>
                          </HStack>
                        ))}
                      </VStack>
                    </Box>
                  )}
                </Box>
              )}

              <Box width="100%">
                <Heading size="sm" mb={2}>
                  Created By
                </Heading>
                <HStack>
                  <Avatar
                    size="sm"
                    name={campaign.createdBy.fullName}
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      campaign.createdBy.fullName
                    )}&background=random`}
                  />
                  <Box>
                    <Text fontWeight="medium">
                      {campaign.createdBy.fullName}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {campaign.createdBy.email}
                    </Text>
                  </Box>
                </HStack>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            {campaign.allowVolunteers && spotsRemaining > 0 && (
              <Button colorScheme="teal">Apply to Volunteer</Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const CampaignsPage = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = useSelector(
    (state) => state?.campaignSlice?.campaigns?.pagination?.totalPages
  );
  useEffect(() => {
    dispatch(fetchAllCampaigns({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);
  // Fetch campaigns from Redux store
  const {
    campaigns = [],
    isLoading,
    error,
  } = useSelector((state) => state?.campaignSlice?.campaigns);
  console.log("the campaigns are", campaigns);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const headingColor = useColorModeValue("gray.800", "white");

  if (isLoading) {
    return (
      <Box bg={bgColor} minH="100vh" py={10}>
        <Container maxW="container.xl">
          <Flex justify="center" align="center" minH="50vh">
            <CustomLoader size="xl" />
          </Flex>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box bg={bgColor} minH="100vh" py={10}>
        <Container maxW="container.xl">
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Error loading campaigns!</AlertTitle>
            <AlertDescription>
              {error.message || "Unknown error occurred"}
            </AlertDescription>
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" py={10}>
      <Container maxW="container.xl">
        <Box textAlign="center" mb={10}>
          <Heading as="h1" size="2xl" mb={3} color={headingColor}>
            Healthcare Campaigns
          </Heading>
          <Text fontSize="xl" maxW="container.md" mx="auto" color="gray.600">
            Join our healthcare initiatives and make a difference in your
            community
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </SimpleGrid>
      </Container>
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages || 1}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </Box>
  );
};

export default CampaignsPage;
