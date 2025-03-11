import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  Save,
  X,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  Box,
  Flex,
  Text,
  Avatar,
  Badge,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Input,
  FormControl,
  FormLabel,
  Select,
  useColorModeValue,
  Container,
  VStack,
  HStack,
  Heading,
  Divider,
  useToast,
  SimpleGrid,
  Icon,
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Skeleton,
  Tag,
} from "@chakra-ui/react";

import { fetchUserById } from "../../features/user/userSlice";
import { fetchUserAppointments } from "../../features/appointment/appointmentSlice";
import { Navigate, useNavigate } from "react-router-dom";

const UserProfile = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state?.auth);
  const userData = user?.data;

  // Get appointments from Redux store
  const { appointments, loading: appointmentsLoading } = useSelector(
    (state) => state?.appointmentSlice
  );
  console.log("The appointments are", appointments);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    address: "",
    phone: "",
    gender: "",
  });

  // Tabs for profile sections
  const [activeTab, setActiveTab] = useState("personal");

  // Fetch user data
  useEffect(() => {
    if (userData?._id) {
      dispatch(fetchUserById(userData._id));
    }
  }, [dispatch, userData?._id]);

  // Fetch user appointments when the appointments tab is selected or on initial load
  useEffect(() => {
    if (
      userData?._id &&
      (activeTab === "appointments" || !appointments.length)
    ) {
      dispatch(fetchUserAppointments(userData._id));
    }
  }, [dispatch, userData?._id, activeTab, appointments.length]);

  // Initialize form data when user data is available
  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.fullName || "",
        userName: userData.userName || "",
        email: userData.email || "",
        address: userData.address || "",
        phone: userData.phone || "",
        gender: userData.gender || "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch an action to update user profile
    console.log("Updated profile data:", formData);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setIsEditing(false);
  };

  const cancelEdit = () => {
    // Reset form data to original user data
    if (userData) {
      setFormData({
        fullName: userData.fullName || "",
        userName: userData.userName || "",
        email: userData.email || "",
        address: userData.address || "",
        phone: userData.phone || "",
        gender: userData.gender || "",
      });
    }
    setIsEditing(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status color for appointments
  const getStatusColor = (status) => {
    const statusColors = {
      scheduled: "blue",
      completed: "green",
      cancelled: "red",
      pending: "orange",
      default: "gray",
    };
    return statusColors[status?.toLowerCase()] || statusColors.default;
  };

  // UI Colors
  const bgGradient = useColorModeValue(
    "linear(to-r, blue.400, teal.400)",
    "linear(to-r, blue.600, teal.600)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "white");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const fieldBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  if (!isAuthenticated) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        minH="100vh"
        bg={useColorModeValue("gray.50", "gray.900")}
        p={6}
      >
        <Icon as={AlertCircle} boxSize={16} color="red.500" mb={4} />
        <Heading mb={2} size="xl" textAlign="center">
          Not Authorized
        </Heading>
        <Text fontSize="lg" color={mutedText} mb={8} textAlign="center">
          Please log in to view your profile
        </Text>
        <Button
          as="a"
          href="/login"
          size="lg"
          bgGradient={bgGradient}
          color="white"
          px={12}
          py={6}
          borderRadius="full"
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "xl",
          }}
          _active={{
            transform: "translateY(0)",
          }}
          transition="all 0.2s"
        >
          Go to Login
        </Button>
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      {/* Profile Header */}
      <Box
        bgGradient={bgGradient}
        borderRadius="xl"
        boxShadow="lg"
        p={{ base: 4, md: 6 }}
        mb={8}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top={0}
          right={0}
          bottom={0}
          left={0}
          bgImage="url('data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E')"
          opacity={0.7}
        />

        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "center", md: "flex-start" }}
          gap={6}
          position="relative"
          zIndex={1}
        >
          <Box
            bg="white"
            p={2}
            borderRadius="full"
            boxShadow="lg"
            animation={{ base: "none", md: "pulse 2s infinite" }}
          >
            <Avatar
              size={{ base: "xl", md: "2xl" }}
              icon={<Icon as={User} boxSize={{ base: 12, md: 16 }} />}
              bg="blue.50"
              color="blue.500"
            />
          </Box>

          <VStack
            spacing={2}
            flex="1"
            align={{ base: "center", md: "flex-start" }}
          >
            <Heading
              color="white"
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
            >
              {userData?.fullName}
            </Heading>
            <HStack spacing={2}>
              <Text color="blue.100" fontSize={{ base: "md", md: "lg" }}>
                @{userData?.userName}
              </Text>
            </HStack>

            <HStack spacing={4} mt={2} display={{ base: "none", md: "flex" }}>
              <HStack color="white" opacity={0.9}>
                <Icon as={Mail} size={16} />
                <Text fontSize="sm">{userData?.email}</Text>
              </HStack>
              {userData?.phone && (
                <HStack color="white" opacity={0.9}>
                  <Icon as={Phone} size={16} />
                  <Text fontSize="sm">{userData?.phone}</Text>
                </HStack>
              )}
            </HStack>
          </VStack>

          <Box mt={{ base: 4, md: 0 }}>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                leftIcon={<Icon as={Edit} size={16} />}
                bg="white"
                color="blue.500"
                size={{ base: "md", md: "lg" }}
                px={6}
                _hover={{
                  bg: "blue.50",
                  transform: "translateY(-2px)",
                  boxShadow: "md",
                }}
                borderRadius="full"
                transition="all 0.2s"
              >
                Edit Profile
              </Button>
            ) : (
              <Button
                onClick={cancelEdit}
                leftIcon={<Icon as={X} size={16} />}
                variant="outline"
                bg="whiteAlpha.200"
                color="white"
                borderColor="whiteAlpha.400"
                _hover={{ bg: "whiteAlpha.300" }}
                borderRadius="full"
              >
                Cancel
              </Button>
            )}
          </Box>
        </Flex>
      </Box>

      {/* Tabs & Content */}
      <Tabs
        variant="line"
        colorScheme="blue"
        size="lg"
        isLazy
        onChange={(index) => {
          const tabs = ["personal", "appointments", "reports", "settings"];
          setActiveTab(tabs[index]);
        }}
      >
        <TabList
          overflowX="auto"
          css={{
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
          borderBottomWidth="1px"
          borderBottomColor={useColorModeValue("gray.200", "gray.700")}
        >
          {["Personal Info", "Appointments", "Reports", "Settings"].map(
            (tab, index) => (
              <Tab
                key={tab}
                fontWeight="medium"
                _selected={{
                  color: "blue.500",
                  borderBottomWidth: "3px",
                  borderBottomColor: "blue.500",
                }}
                px={{ base: 3, md: 6 }}
                py={4}
                fontSize={{ base: "sm", md: "md" }}
                whiteSpace="nowrap"
              >
                {tab}
              </Tab>
            )
          )}
        </TabList>

        <TabPanels mt={6}>
          {/* Personal Info Tab */}
          <TabPanel px={0}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              {/* Profile Info Card */}
              <Card
                bg={cardBg}
                borderRadius="xl"
                boxShadow="md"
                gridColumn={{ base: "span 1", md: "span 2" }}
                overflow="hidden"
              >
                <Box h={3} bgGradient={bgGradient} w="full" />
                <CardBody p={6}>
                  <Heading size="md" mb={6} color={textColor}>
                    Profile Information
                  </Heading>
                  <form onSubmit={handleSubmit}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <FormControl>
                        <FormLabel
                          fontSize="sm"
                          fontWeight="medium"
                          color={mutedText}
                        >
                          Full Name
                        </FormLabel>
                        {isEditing ? (
                          <Input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            focusBorderColor="blue.400"
                          />
                        ) : (
                          <Box
                            p={3}
                            bg={fieldBg}
                            borderRadius="md"
                            fontWeight="medium"
                            color={textColor}
                          >
                            {userData?.fullName || "Not specified"}
                          </Box>
                        )}
                      </FormControl>

                      <FormControl>
                        <FormLabel
                          fontSize="sm"
                          fontWeight="medium"
                          color={mutedText}
                        >
                          Username
                        </FormLabel>
                        {isEditing ? (
                          <Input
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            focusBorderColor="blue.400"
                          />
                        ) : (
                          <Box
                            p={3}
                            bg={fieldBg}
                            borderRadius="md"
                            fontWeight="medium"
                            color={textColor}
                          >
                            {userData?.userName || "Not specified"}
                          </Box>
                        )}
                      </FormControl>

                      <FormControl>
                        <FormLabel
                          fontSize="sm"
                          fontWeight="medium"
                          color={mutedText}
                        >
                          Email
                        </FormLabel>
                        {isEditing ? (
                          <Input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            focusBorderColor="blue.400"
                            type="email"
                          />
                        ) : (
                          <Box
                            p={3}
                            bg={fieldBg}
                            borderRadius="md"
                            fontWeight="medium"
                            color={textColor}
                          >
                            {userData?.email || "Not specified"}
                          </Box>
                        )}
                      </FormControl>

                      <FormControl>
                        <FormLabel
                          fontSize="sm"
                          fontWeight="medium"
                          color={mutedText}
                        >
                          Phone
                        </FormLabel>
                        {isEditing ? (
                          <Input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            focusBorderColor="blue.400"
                          />
                        ) : (
                          <Box
                            p={3}
                            bg={fieldBg}
                            borderRadius="md"
                            fontWeight="medium"
                            color={textColor}
                          >
                            {userData?.phone || "Not specified"}
                          </Box>
                        )}
                      </FormControl>

                      <FormControl>
                        <FormLabel
                          fontSize="sm"
                          fontWeight="medium"
                          color={mutedText}
                        >
                          Address
                        </FormLabel>
                        {isEditing ? (
                          <Input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            focusBorderColor="blue.400"
                          />
                        ) : (
                          <Box
                            p={3}
                            bg={fieldBg}
                            borderRadius="md"
                            fontWeight="medium"
                            color={textColor}
                          >
                            {userData?.address || "Not specified"}
                          </Box>
                        )}
                      </FormControl>

                      <FormControl>
                        <FormLabel
                          fontSize="sm"
                          fontWeight="medium"
                          color={mutedText}
                        >
                          Gender
                        </FormLabel>
                        {isEditing ? (
                          <Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            focusBorderColor="blue.400"
                          >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">
                              Prefer not to say
                            </option>
                          </Select>
                        ) : (
                          <Box
                            p={3}
                            bg={fieldBg}
                            borderRadius="md"
                            fontWeight="medium"
                            color={textColor}
                          >
                            {userData?.gender || "Not specified"}
                          </Box>
                        )}
                      </FormControl>
                    </SimpleGrid>

                    {isEditing && (
                      <Button
                        mt={8}
                        type="submit"
                        colorScheme="green"
                        size="lg"
                        leftIcon={<Icon as={Save} />}
                        px={8}
                        borderRadius="lg"
                        _hover={{
                          transform: "translateY(-2px)",
                          boxShadow: "md",
                        }}
                        transition="all 0.2s"
                      >
                        Save Changes
                      </Button>
                    )}
                  </form>
                </CardBody>
              </Card>

              {/* Activity Card */}
              <Card
                bg={cardBg}
                borderRadius="xl"
                boxShadow="md"
                overflow="hidden"
              >
                <Box
                  h={3}
                  bgGradient="linear(to-r, purple.400, pink.400)"
                  w="full"
                />
                <CardBody p={6}>
                  <Heading size="md" mb={6} color={textColor}>
                    Recent Activity
                  </Heading>

                  <VStack spacing={4} align="stretch">
                    {[
                      {
                        text: "Profile updated",
                        icon: Edit,
                        time: "2 hours ago",
                      },
                      {
                        text: "New appointment scheduled",
                        icon: Calendar,
                        time: "Yesterday",
                      },
                      {
                        text: "Report downloaded",
                        icon: Clock,
                        time: "3 days ago",
                      },
                    ].map((activity, index) => (
                      <HStack key={index} spacing={3}>
                        <Flex
                          p={2}
                          bg="blue.50"
                          color="blue.500"
                          borderRadius="md"
                          align="center"
                          justify="center"
                        >
                          <Icon as={activity.icon} boxSize={5} />
                        </Flex>
                        <Box flex="1">
                          <Text fontWeight="medium" color={textColor}>
                            {activity.text}
                          </Text>
                          <Text fontSize="sm" color={mutedText}>
                            {activity.time}
                          </Text>
                        </Box>
                      </HStack>
                    ))}
                  </VStack>

                  <Button
                    variant="outline"
                    colorScheme="blue"
                    size="sm"
                    width="full"
                    mt={6}
                  >
                    View All Activity
                  </Button>
                </CardBody>
              </Card>
            </SimpleGrid>
          </TabPanel>

          {/* Appointments Tab */}
          <TabPanel px={0}>
            <Card
              bg={cardBg}
              borderRadius="xl"
              boxShadow="md"
              overflow="hidden"
            >
              <Box
                h={3}
                bgGradient="linear(to-r, orange.400, red.400)"
                w="full"
              />
              <CardBody p={6}>
                <Flex justify="space-between" align="center" mb={6}>
                  <Heading size="md" color={textColor}>
                    Your Appointments
                  </Heading>
                  <Button
                    onClick={() => navigate("/book-appointment")} // Wrapped in an arrow function
                    colorScheme="blue"
                    size="sm"
                    leftIcon={<Icon as={Calendar} boxSize={4} />} // Use 'boxSize' for proper icon sizing
                  >
                    Schedule New
                  </Button>
                </Flex>

                {appointmentsLoading ? (
                  // Loading skeleton
                  <VStack spacing={4} align="stretch">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} height="60px" borderRadius="md" />
                    ))}
                  </VStack>
                ) : (
                  <TableContainer>
                    <Table
                      variant="simple"
                      borderWidth="1px"
                      borderColor={borderColor}
                      borderRadius="md"
                    >
                      <Thead bg={fieldBg}>
                        <Tr>
                          <Th>Title</Th>
                          <Th>Hospital</Th> {/* New column */}
                          <Th>Date & Time</Th>
                          <Th>Status</Th>
                          <Th>Payment Status</Th> {/* New column */}
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>

                      <Tbody>
                        {appointments && appointments.length > 0 ? (
                          appointments.map((appointment) => (
                            <Tr key={appointment._id}>
                              <Td fontWeight="medium">Doctor Appointment</Td>{" "}
                              {/* Static title */}
                              <Td>{formatDate(appointment.date)}</Td>{" "}
                              {/* Updated to `date` */}
                              <Td>{appointment.hospital.name}</Td>{" "}
                              {/* Show hospital name */}
                              <Td>
                                <Tag
                                  colorScheme={getStatusColor(
                                    appointment.status
                                  )}
                                  borderRadius="full"
                                >
                                  {appointment.status}
                                </Tag>
                              </Td>
                              <Td>
                                <Tag
                                  colorScheme={
                                    appointment.paymentStatus === "paid"
                                      ? "green"
                                      : "gray"
                                  }
                                  borderRadius="full"
                                >
                                  {appointment.paymentStatus}
                                </Tag>
                              </Td>
                              <Td>
                                <HStack spacing={2}>
                                  <Button
                                    size="sm"
                                    colorScheme="blue"
                                    variant="outline"
                                  >
                                    View
                                  </Button>
                                  {appointment.status !== "completed" &&
                                    appointment.status !== "cancelled" && (
                                      <Button
                                        size="sm"
                                        colorScheme="red"
                                        variant="ghost"
                                      >
                                        Cancel
                                      </Button>
                                    )}
                                </HStack>
                              </Td>
                            </Tr>
                          ))
                        ) : (
                          <Tr>
                            <Td colSpan={6} textAlign="center" py={6}>
                              <VStack spacing={3}>
                                <Icon
                                  as={Calendar}
                                  boxSize={8}
                                  color="gray.400"
                                />
                                <Text color={mutedText}>
                                  No appointments found
                                </Text>
                                <Button
                                  size="sm"
                                  colorScheme="blue"
                                  onClick={() => navigate("/book-appointment")}
                                >
                                  Schedule your first appointment
                                </Button>
                              </VStack>
                            </Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  </TableContainer>
                )}

                {appointments && appointments.length > 0 && (
                  <Flex justify="space-between" align="center" mt={6}>
                    <Text color={mutedText} fontSize="sm">
                      Showing {appointments.length} appointments
                    </Text>
                    <Button variant="link" colorScheme="blue" size="sm">
                      View All Appointments
                    </Button>
                  </Flex>
                )}
              </CardBody>
            </Card>
          </TabPanel>

          {/* Reports Tab */}
          <TabPanel px={0}>
            <Card bg={cardBg} borderRadius="xl" boxShadow="md" p={6}>
              <Heading size="md" mb={4}>
                Reports
              </Heading>
              <Text color={mutedText}>
                Your reports and analytics will appear here.
              </Text>
            </Card>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel px={0}>
            <Card bg={cardBg} borderRadius="xl" boxShadow="md" p={6}>
              <Heading size="md" mb={4}>
                Settings
              </Heading>
              <Text color={mutedText}>
                Account settings and preferences will appear here.
              </Text>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default UserProfile;
