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
  Skeleton,
  SkeletonCircle,
  SkeletonText,
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
  AlertCircleIcon,
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

// Get time remaining until campaign starts
const getTimeRemaining = (futureDate, currentDate) => {
  const diffTime = Math.abs(futureDate - currentDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7
    ? `${diffDays} ${diffDays === 1 ? "day" : "days"}`
    : null;
};

// Campaign Card Loading Skeleton
const CampaignCardSkeleton = () => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={cardBg}
      borderColor={borderColor}
      boxShadow="sm"
      height="100%"
    >
      <Box p={5}>
        <Flex justify="space-between" align="center" mb={2}>
          <Skeleton height="24px" width="80px" />
          <Skeleton height="24px" width="100px" />
        </Flex>

        <SkeletonText mt={2} noOfLines={1} skeletonHeight={6} width="80%" />
        <SkeletonText mt={4} noOfLines={2} spacing={2} />

        <Stack spacing={2} mt={6}>
          <Flex align="center">
            <SkeletonCircle size="4" mr={2} />
            <Skeleton height="16px" width="120px" />
          </Flex>
          <Flex align="center">
            <SkeletonCircle size="4" mr={2} />
            <Skeleton height="16px" width="150px" />
          </Flex>
          <Flex align="center">
            <SkeletonCircle size="4" mr={2} />
            <Skeleton height="16px" width="140px" />
          </Flex>
        </Stack>

        <Divider my={4} />

        <Flex justify="space-between" align="center">
          <Skeleton height="32px" width="90px" />
          <Skeleton height="32px" width="100px" />
        </Flex>
      </Box>
    </Box>
  );
};

const CampaignCard = ({ campaign }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  // Color mode values
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const upcomingBadgeBg = useColorModeValue("blue.50", "blue.900");
  const upcomingBadgeColor = useColorModeValue("blue.600", "blue.200");
  const pastBadgeBg = useColorModeValue("gray.100", "gray.700");
  const pastBadgeColor = useColorModeValue("gray.600", "gray.400");

  // Date calculations
  const campaignDate = new Date(campaign.date);
  const currentDate = new Date();
  const isUpcoming = campaignDate > currentDate;
  const formattedDate = formatDate(campaign.date);
  const timeRemaining = isUpcoming
    ? getTimeRemaining(campaignDate, currentDate)
    : null;

  // Visual treatment for past campaigns
  const cardOpacity = isUpcoming ? 1 : 0.85;
  const cardFilter = isUpcoming ? "none" : "grayscale(20%)";

  // Volunteer status
  const spotsRemaining = getVolunteerSpotsRemaining(campaign);
  const isFull = spotsRemaining <= 0;

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
        _hover={{
          transform: isUpcoming ? "translateY(-5px)" : "none",
          boxShadow: isUpcoming ? "md" : "sm",
        }}
        opacity={cardOpacity}
        style={{ filter: cardFilter }}
        height="100%"
        display="flex"
        flexDirection="column"
      >
        <Box p={5} flex="1" display="flex" flexDirection="column">
          <Flex justify="space-between" align="center" mb={2}>
            <Badge
              px={2}
              py={1}
              bg={isUpcoming ? upcomingBadgeBg : pastBadgeBg}
              color={isUpcoming ? upcomingBadgeColor : pastBadgeColor}
              borderRadius="full"
            >
              {isUpcoming ? "Upcoming" : "Past"}
            </Badge>

            {isUpcoming && campaign.allowVolunteers && (
              <Tag
                size="sm"
                colorScheme={isFull ? "red" : "blue"}
                borderRadius="full"
              >
                <TagLabel>
                  {isFull ? "Full" : `${spotsRemaining} spots left`}
                </TagLabel>
              </Tag>
            )}

            {!isUpcoming && (
              <Tag size="sm" colorScheme="gray" borderRadius="full">
                <TagLabel>Ended</TagLabel>
              </Tag>
            )}
          </Flex>

          {timeRemaining && (
            <Tag
              size="sm"
              colorScheme="orange"
              borderRadius="full"
              mb={2}
              width="fit-content"
            >
              <ClockIcon size={12} style={{ marginRight: "4px" }} />
              <TagLabel>Starts in {timeRemaining}</TagLabel>
            </Tag>
          )}

          <Heading as="h3" size="md" mb={2} noOfLines={1}>
            {campaign.title}
          </Heading>

          <Text color={textColor} noOfLines={2} mb={3}>
            {campaign.description}
          </Text>

          <Stack spacing={2} mt={4} mb="auto">
            <Flex align="center">
              <Icon as={CalendarIcon} color="blue.500" mr={2} />
              <Text fontSize="sm">{formattedDate}</Text>
            </Flex>

            <Flex align="center">
              <Icon as={MapPinIcon} color="blue.500" mr={2} />
              <Text fontSize="sm" noOfLines={1}>
                {campaign.location}
              </Text>
            </Flex>

            <Flex align="center">
              <Icon as={HospitalIcon} color="blue.500" mr={2} />
              <Text fontSize="sm" noOfLines={1}>
                {campaign.hospital.name}
              </Text>
            </Flex>
          </Stack>

          <Divider my={4} />

          <Flex justify="space-between" align="center">
            <Button
              size="sm"
              colorScheme="blue"
              variant="outline"
              onClick={onOpen}
              leftIcon={<InfoIcon size={16} />}
            >
              Details
            </Button>

            {campaign.allowVolunteers && isUpcoming && spotsRemaining > 0 && (
              <Button
                onClick={handleVolunteer}
                size="sm"
                colorScheme="blue"
                leftIcon={<UserIcon size={16} />}
              >
                Volunteer
              </Button>
            )}

            {campaign.allowVolunteers && isUpcoming && spotsRemaining <= 0 && (
              <Tooltip label="No volunteer slots available">
                <Button
                  size="sm"
                  colorScheme="gray"
                  isDisabled={true}
                  leftIcon={<UsersIcon size={16} />}
                >
                  Full
                </Button>
              </Tooltip>
            )}

            {campaign.allowVolunteers && !isUpcoming && (
              <Tooltip label="This campaign has already ended">
                <Button
                  size="sm"
                  colorScheme="gray"
                  isDisabled={true}
                  leftIcon={<ClockIcon size={16} />}
                >
                  Ended
                </Button>
              </Tooltip>
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
              <Flex width="100%" justify="space-between" wrap="wrap" gap={2}>
                <Badge
                  px={2}
                  py={1}
                  bg={isUpcoming ? upcomingBadgeBg : pastBadgeBg}
                  color={isUpcoming ? upcomingBadgeColor : pastBadgeColor}
                  borderRadius="full"
                >
                  {isUpcoming ? "Upcoming" : "Past"}
                </Badge>

                {campaign.allowVolunteers && (
                  <Tag
                    size="sm"
                    colorScheme={spotsRemaining > 0 ? "blue" : "red"}
                    borderRadius="full"
                  >
                    <TagLabel>
                      {spotsRemaining > 0
                        ? `${spotsRemaining}/${campaign.maxVolunteers} spots available`
                        : "No spots available"}
                    </TagLabel>
                  </Tag>
                )}
              </Flex>

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
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <HStack>
                    <Icon as={CalendarIcon} color="blue.500" />
                    <Text>{formattedDate}</Text>
                  </HStack>

                  <HStack>
                    <Icon as={MapPinIcon} color="blue.500" />
                    <Text>{campaign.location}</Text>
                  </HStack>

                  <HStack>
                    <Icon as={HospitalIcon} color="blue.500" />
                    <Text>{campaign.hospital.name}</Text>
                  </HStack>

                  <HStack>
                    <Icon as={ClockIcon} color="blue.500" />
                    <Text>{isUpcoming ? "Upcoming" : "Past"}</Text>
                  </HStack>
                </SimpleGrid>
              </Box>

              {campaign.allowVolunteers && (
                <Box width="100%">
                  <Heading size="sm" mb={2}>
                    Volunteer Information
                  </Heading>

                  {!isUpcoming && (
                    <Alert status="info" mb={3} borderRadius="md">
                      <AlertIcon as={AlertCircleIcon} />
                      <AlertDescription>
                        This campaign has already ended and is no longer
                        accepting volunteers.
                      </AlertDescription>
                    </Alert>
                  )}

                  <HStack mb={2}>
                    <Icon as={UsersIcon} color="blue.500" />
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
                              colorScheme="blue"
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
                        {campaign.volunteerQuestions.map((q, index) => (
                          <HStack key={q._id || index}>
                            <Icon
                              as={q.isRequired ? CheckCircleIcon : XCircleIcon}
                              color={q.isRequired ? "green.500" : "gray.500"}
                              size={4}
                            />
                            <Text fontSize="sm">{q.question}</Text>
                            {q.isRequired && (
                              <Badge colorScheme="red" size="xs">
                                Required
                              </Badge>
                            )}
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

            {campaign.allowVolunteers && spotsRemaining > 0 && isUpcoming && (
              <Button
                colorScheme="blue"
                onClick={() => {
                  onClose();
                  navigate(`/campaigns/${campaign._id}`);
                }}
              >
                Apply to Volunteer
              </Button>
            )}

            {campaign.allowVolunteers && spotsRemaining <= 0 && isUpcoming && (
              <Button colorScheme="gray" isDisabled={true}>
                No Spots Available
              </Button>
            )}

            {campaign.allowVolunteers && !isUpcoming && (
              <Button colorScheme="gray" isDisabled={true}>
                Campaign Ended
              </Button>
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
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const totalPages = useSelector(
    (state) => state?.campaignSlice?.campaigns?.pagination?.totalPages
  );

  // Fetch campaigns
  useEffect(() => {
    dispatch(fetchAllCampaigns({ page: currentPage, limit: 10 })).finally(() =>
      setIsInitialLoading(false)
    );
  }, [dispatch, currentPage]);

  // Get campaign data from Redux store
  const {
    campaigns = [],
    isLoading,
    error,
  } = useSelector((state) => state?.campaignSlice?.campaigns);
  console.log("Campaigns:", campaigns);

  // Sort campaigns - upcoming first (sorted by nearest date), then past (sorted by most recent)
  const sortedCampaigns = [...(campaigns || [])].sort((a, b) => {
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);
    const currentDate = new Date();

    const aIsUpcoming = aDate > currentDate;
    const bIsUpcoming = bDate > currentDate;

    // First sort by upcoming/past
    if (aIsUpcoming && !bIsUpcoming) return -1;
    if (!aIsUpcoming && bIsUpcoming) return 1;

    // For campaigns in the same category
    if (aIsUpcoming) {
      // Both upcoming - sort by closest date first
      return aDate - bDate;
    } else {
      // Both past - sort by most recent first
      return bDate - aDate;
    }
  });
  console.log("Sorted Campaigns:", sortedCampaigns);

  // Color mode values
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const headingColor = useColorModeValue("gray.800", "white");

  // Initial loading state
  if (isInitialLoading) {
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
            {[...Array(6)].map((_, index) => (
              <CampaignCardSkeleton key={index} />
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box bg={bgColor} minH="100vh" py={10}>
        <Container maxW="container.xl">
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            <Box>
              <AlertTitle>Error loading campaigns!</AlertTitle>
              <AlertDescription>
                {error.message || "Unknown error occurred"}
              </AlertDescription>
            </Box>
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

        {/* Loading overlay for pagination changes */}
        {isLoading && !isInitialLoading && (
          <Flex justify="center" align="center" py={8} position="relative">
            <CustomLoader size="lg" />
          </Flex>
        )}

        {/* No campaigns state */}
        {!isLoading && sortedCampaigns.length === 0 ? (
          <Box
            textAlign="center"
            p={10}
            bg="white"
            borderRadius="lg"
            shadow="sm"
            width="100%"
            my={10}
          >
            <Icon as={InfoIcon} boxSize={12} color="gray.400" mb={4} />
            <Heading size="md" mb={2}>
              No Campaigns Available
            </Heading>
            <Text color="gray.500">
              There are currently no healthcare campaigns available.
            </Text>
          </Box>
        ) : (
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={8}
            opacity={isLoading && !isInitialLoading ? 0.6 : 1}
            transition="opacity 0.2s"
          >
            {sortedCampaigns.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </SimpleGrid>
        )}

        {/* Pagination */}
        {sortedCampaigns.length > 0 && (
          <Box mt={10}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages || 1}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CampaignsPage;
