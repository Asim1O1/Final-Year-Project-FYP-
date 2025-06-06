import {
  Avatar,
  Badge,
  Box,
  Button,
  CalendarIcon,
  Card,
  CardBody,
  CardHeader,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  Divider,
  EmailIcon,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
  InfoIcon,
  QuestionIcon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  TimeIcon,
  Tr,
  useColorModeValue,
} from "@chakra-ui/icons";
import { AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVolunteerRequests,
  handleVolunteerRequest,
} from "../../../features/campaign/campaignSlice";
import Pagination from "../../../utils/Pagination";
import CustomLoader from "../../common/CustomSpinner";
const VolunteerRequestsManager = () => {
  const dispatch = useDispatch();
  const [expandedRequests, setExpandedRequests] = useState({});
  const { volunteerRequests, isLoading, error } = useSelector(
    (state) => state?.campaignSlice
  );
  const { currentPage, totalPages } = useSelector(
    (state) => state?.campaignSlice?.volunteerRequests
  );

  const [processingIds, setProcessingIds] = useState([]);

  useEffect(() => {
    console.log("eneterd the user effect to fetch all volunteer requests");
    dispatch(fetchVolunteerRequests({ page: 1, limit: 10 }));
  }, [dispatch]);

  const toggleRequestDetails = (requestId) => {
    setExpandedRequests((prev) => ({
      ...prev,
      [requestId]: !prev[requestId],
    }));
  };

  const bgGradient = useColorModeValue(
    "linear(to-br, white, gray.50)",
    "linear(to-br, gray.800, gray.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const textMuted = useColorModeValue("gray.500", "gray.400");
  const iconColor = useColorModeValue("gray.400", "gray.500");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const expandedBg = useColorModeValue("gray.50", "gray.700");
  const purpleAccent = useColorModeValue("purple.500", "purple.300");
  const purpleBg = useColorModeValue("purple.50", "purple.900");

  // Status colors
  const statusColors = {
    pending: {
      bg: useColorModeValue("yellow.50", "yellow.900"),
      color: useColorModeValue("yellow.700", "yellow.200"),
      dot: useColorModeValue("yellow.500", "yellow.300"),
    },
    approved: {
      bg: useColorModeValue("green.50", "green.900"),
      color: useColorModeValue("green.700", "green.200"),
      dot: useColorModeValue("green.500", "green.300"),
    },
    rejected: {
      bg: useColorModeValue("red.50", "red.900"),
      color: useColorModeValue("red.700", "red.200"),
      dot: useColorModeValue("red.500", "red.300"),
    },
  };

  const handleRequest = async (campaignId, requestId, status) => {
    const requestIdentifier = `${campaignId}-${requestId}`;
    setProcessingIds((prev) => [...prev, requestIdentifier]);

    try {
      const result = await dispatch(
        handleVolunteerRequest({ campaignId, requestId, status })
      ).unwrap();
      dispatch(fetchVolunteerRequests({ page: currentPage, limit: 10 }));

      console.log("The result is", result);
    } catch (err) {
      console.error("Failed to handle request:", err);
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== requestIdentifier));
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= volunteerRequests?.totalPages) {
      dispatch(fetchVolunteerRequests({ page: newPage, limit: 10 }));
    }
  };

  if (isLoading && volunteerRequests.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <CustomLoader className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading volunteer requests...</span>
      </div>
    );
  }

  if (error) {
    console.log("the erroir is error");
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        <AlertCircle className="w-8 h-8 mr-2" />
        <span>{error.message || "Error loading requests"}</span>
      </div>
    );
  }

  return (
    <Box
      bgGradient={bgGradient}
      borderRadius="xl"
      boxShadow="lg"
      p={6}
      maxW="6xl"
      mx="auto"
    >
      <Card>
        <CardHeader px={0} pt={0}>
          <Flex
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            align={{ base: "start", sm: "center" }}
            gap={4}
            mb={2}
          >
            <Flex align="center" gap={2}>
              <Box bg={purpleBg} color={purpleAccent} p={2} borderRadius="lg">
                <QuestionIcon boxSize={6} />
              </Box>
              <Heading as="h1" size="lg" color={textColor}>
                Volunteer Requests
              </Heading>
            </Flex>
            <HStack spacing={3}></HStack>
          </Flex>
          <Text color={textMuted} mt={1}>
            Manage and respond to volunteer applications for your campaigns
          </Text>
          <Divider mt={4} borderColor={borderColor} />
        </CardHeader>
      </Card>

      <Box px={0} pb={0}>
        {volunteerRequests.data?.length === 0 ? (
          <Card bg={purpleBg} borderColor={borderColor} boxShadow="sm">
            <CardBody p={6}>
              <Flex
                direction={{ base: "column", sm: "row" }}
                align="center"
                gap={4}
              >
                <Box bg={cardBg} p={3} borderRadius="full" boxShadow="sm">
                  <InfoIcon boxSize={8} color={purpleAccent} />
                </Box>
                <Box textAlign={{ base: "center", sm: "left" }}>
                  <Heading as="h3" size="md" color={purpleAccent}>
                    No Volunteer Requests Found
                  </Heading>
                  <Text color={purpleAccent} mt={1}>
                    Check back later for new volunteer applications.
                  </Text>
                </Box>
              </Flex>
            </CardBody>
          </Card>
        ) : (
          <>
            <Box
              bg={cardBg}
              borderRadius="xl"
              boxShadow="sm"
              border="1px"
              borderColor={borderColor}
              overflow="hidden"
            >
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr bg={headerBg}>
                      <Th
                        px={6}
                        py={4}
                        textTransform="uppercase"
                        fontSize="xs"
                        color={textMuted}
                      >
                        Campaign
                      </Th>
                      <Th
                        px={6}
                        py={4}
                        textTransform="uppercase"
                        fontSize="xs"
                        color={textMuted}
                      >
                        Volunteer
                      </Th>
                      <Th
                        px={6}
                        py={4}
                        textTransform="uppercase"
                        fontSize="xs"
                        color={textMuted}
                      >
                        Requested At
                      </Th>
                      <Th
                        px={6}
                        py={4}
                        textTransform="uppercase"
                        fontSize="xs"
                        color={textMuted}
                      >
                        Status
                      </Th>
                      <Th
                        px={6}
                        py={4}
                        textTransform="uppercase"
                        fontSize="xs"
                        color={textMuted}
                      >
                        Actions
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {volunteerRequests.data?.map((campaign) =>
                      campaign.volunteerRequests.map((request) => {
                        const requestIdentifier = `${campaign._id}-${request._id}`;
                        const isProcessing =
                          processingIds.includes(requestIdentifier);
                        const isExpanded = expandedRequests[request._id];

                        return (
                          <React.Fragment key={request._id}>
                            <Tr
                              _hover={{ bg: hoverBg }}
                              transition="colors 0.15s"
                              bg={isExpanded ? expandedBg : "transparent"}
                              borderBottomWidth="1px"
                              borderColor={borderColor}
                            >
                              <Td px={6} py={4}>
                                <Text fontWeight="medium" color={textColor}>
                                  {campaign.title}
                                </Text>
                                <Flex
                                  align="center"
                                  fontSize="sm"
                                  color={textMuted}
                                  mt={1}
                                >
                                  <CalendarIcon
                                    boxSize={3.5}
                                    mr={1.5}
                                    color={iconColor}
                                  />
                                  {new Date(campaign.date).toLocaleDateString()}
                                </Flex>
                                <Flex
                                  align="center"
                                  fontSize="sm"
                                  color={textMuted}
                                  mt={1}
                                >
                                  <Box as="span" mr={1.5} color={iconColor}>
                                    📍
                                  </Box>
                                  {campaign.location}
                                </Flex>
                              </Td>
                              <Td px={6} py={4}>
                                <Flex align="center">
                                  <Avatar
                                    size="md"
                                    name={request.user.name}
                                    bg={purpleBg}
                                    color={purpleAccent}
                                  />
                                  <Box ml={4}>
                                    <Text fontWeight="medium" color={textColor}>
                                      {request.user.name}
                                    </Text>
                                    <Flex
                                      align="center"
                                      fontSize="sm"
                                      color={textMuted}
                                    >
                                      <EmailIcon
                                        boxSize={3.5}
                                        mr={1.5}
                                        color={iconColor}
                                      />
                                      {request.user.email}
                                    </Flex>
                                  </Box>
                                </Flex>
                              </Td>
                              <Td px={6} py={4} fontSize="sm" color={textColor}>
                                <Flex align="center">
                                  <TimeIcon
                                    boxSize={3.5}
                                    mr={1.5}
                                    color={iconColor}
                                  />
                                  {new Date(
                                    request.requestedAt
                                  ).toLocaleDateString()}
                                </Flex>
                              </Td>
                              <Td px={6} py={4}>
                                <Badge
                                  px={3}
                                  py={1}
                                  borderRadius="full"
                                  bg={statusColors[request.status].bg}
                                  color={statusColors[request.status].color}
                                >
                                  <Flex align="center">
                                    <Box
                                      h={2}
                                      w={2}
                                      borderRadius="full"
                                      bg={statusColors[request.status].dot}
                                      mr={1.5}
                                    />
                                    {request.status.charAt(0).toUpperCase() +
                                      request.status.slice(1)}
                                  </Flex>
                                </Badge>
                              </Td>
                              <Td px={6} py={4} fontSize="sm">
                                <Flex gap={2}>
                                  {request.status === "pending" ? (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() =>
                                          handleRequest(
                                            campaign._id,
                                            request._id,
                                            "approved"
                                          )
                                        }
                                        isDisabled={isProcessing}
                                        leftIcon={
                                          isProcessing ? (
                                            <CustomLoader />
                                          ) : (
                                            <CheckIcon />
                                          )
                                        }
                                        color="green.600"
                                        _hover={{
                                          bg: "green.50",
                                          color: "green.700",
                                        }}
                                        border="1px"
                                        borderColor="green.200"
                                      >
                                        Approve
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() =>
                                          handleRequest(
                                            campaign._id,
                                            request._id,
                                            "rejected"
                                          )
                                        }
                                        isDisabled={isProcessing}
                                        leftIcon={
                                          isProcessing ? (
                                            <CustomLoader />
                                          ) : (
                                            <CloseIcon />
                                          )
                                        }
                                        color="red.600"
                                        _hover={{
                                          bg: "red.50",
                                          color: "red.700",
                                        }}
                                        border="1px"
                                        borderColor="red.200"
                                      >
                                        Reject
                                      </Button>
                                    </>
                                  ) : (
                                    <Text
                                      fontStyle="italic"
                                      color={textMuted}
                                      px={2}
                                    >
                                      {request.status === "approved"
                                        ? "Approved"
                                        : "Rejected"}
                                    </Text>
                                  )}
                                  <IconButton
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      toggleRequestDetails(request._id)
                                    }
                                    aria-label="Toggle details"
                                    icon={
                                      isExpanded ? (
                                        <ChevronUpIcon />
                                      ) : (
                                        <ChevronDownIcon />
                                      )
                                    }
                                    borderRadius="full"
                                    _hover={{ bg: hoverBg }}
                                  />
                                </Flex>
                              </Td>
                            </Tr>
                            <Tr display={isExpanded ? "table-row" : "none"}>
                              <Td
                                colSpan={5}
                                p={0}
                                borderBottom="1px"
                                borderColor={borderColor}
                              >
                                <Box
                                  bg={expandedBg}
                                  p={6}
                                  borderTop="1px"
                                  borderColor={borderColor}
                                >
                                  <Flex align="center" mb={4}>
                                    <Box
                                      bg={purpleBg}
                                      color={purpleAccent}
                                      p={1.5}
                                      borderRadius="md"
                                      mr={2}
                                    >
                                      <QuestionIcon boxSize={4} />
                                    </Box>
                                    <Heading
                                      as="h3"
                                      size="md"
                                      color={textColor}
                                    >
                                      Volunteer Questions & Answers
                                    </Heading>
                                  </Flex>
                                  {request.answers &&
                                  request.answers.length > 0 ? (
                                    <Grid
                                      templateColumns={{
                                        base: "1fr",
                                        md: "repeat(2, 1fr)",
                                      }}
                                      gap={4}
                                    >
                                      {request.answers.map((answer, index) => (
                                        <Card
                                          key={index}
                                          bg={cardBg}
                                          boxShadow="sm"
                                          borderColor={borderColor}
                                        >
                                          <CardBody p={4}>
                                            <Text
                                              fontWeight="medium"
                                              color={textColor}
                                              mb={2}
                                            >
                                              {answer.question ||
                                                `Question ${index + 1}`}
                                            </Text>
                                            {typeof answer.answer ===
                                            "boolean" ? (
                                              <Flex align="center" mt={1}>
                                                <Flex
                                                  align="center"
                                                  justify="center"
                                                  w={5}
                                                  h={5}
                                                  borderRadius="full"
                                                  bg={
                                                    answer.answer
                                                      ? "green.100"
                                                      : "red.100"
                                                  }
                                                  mr={2}
                                                >
                                                  {answer.answer ? (
                                                    <CheckIcon
                                                      boxSize={3}
                                                      color="green.600"
                                                    />
                                                  ) : (
                                                    <CloseIcon
                                                      boxSize={3}
                                                      color="red.600"
                                                    />
                                                  )}
                                                </Flex>
                                                <Text
                                                  color={
                                                    answer.answer
                                                      ? "green.700"
                                                      : "red.700"
                                                  }
                                                >
                                                  {answer.answer ? "Yes" : "No"}
                                                </Text>
                                              </Flex>
                                            ) : (
                                              <Text
                                                color={textColor}
                                                bg={expandedBg}
                                                p={3}
                                                borderRadius="md"
                                              >
                                                {answer.answer}
                                              </Text>
                                            )}
                                          </CardBody>
                                        </Card>
                                      ))}
                                    </Grid>
                                  ) : (
                                    <Card
                                      bg={cardBg}
                                      boxShadow="sm"
                                      borderColor={borderColor}
                                    >
                                      <CardBody p={4}>
                                        <Text
                                          color={textMuted}
                                          fontStyle="italic"
                                        >
                                          No answers provided
                                        </Text>
                                      </CardBody>
                                    </Card>
                                  )}
                                </Box>
                              </Td>
                            </Tr>
                          </React.Fragment>
                        );
                      })
                    )}
                  </Tbody>
                </Table>
              </Box>
            </Box>

            <Flex justify="center" mt={8}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages || 1}
                onPageChange={handlePageChange}
              />
            </Flex>
          </>
        )}
      </Box>
    </Box>
  );
};

export default VolunteerRequestsManager;
