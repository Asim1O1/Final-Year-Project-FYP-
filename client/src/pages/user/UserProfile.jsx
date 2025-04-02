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
  AlertCircle,
  Eye,
  FileText,
} from "lucide-react";
import {
  Box,
  Flex,
  Text,
  Avatar,
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
  Center,
  Spinner,
} from "@chakra-ui/react";
import { Download } from "lucide-react";

import { fetchUserById } from "../../features/user/userSlice";
import { fetchUserAppointments } from "../../features/appointment/appointmentSlice";

import { fetchUserMedicalReports } from "../../features/test_report/testReportSlice";
import { handleDownloadMedicalReport } from "../../features/test_report/testReportSlice";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state?.auth);
  const userData = user?.data;

  const { reports, isLoading: reportsLoading } = useSelector(
    (state) => state?.testReportSlice || { reports: [], loading: false }
  );

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
  useEffect(() => {
    if (userData?._id && activeTab === "reports") {
      dispatch(fetchUserMedicalReports(userData._id));
    }
  }, [dispatch, userData?._id, activeTab]);

  const handleDownloadReport = (reportId) => {
    dispatch(handleDownloadMedicalReport(reportId));
  };

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
  "linear(to-r, blue.500, teal.500)",
  "linear(to-r, blue.600, teal.600)"
);

if (!isAuthenticated) {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      bg={useColorModeValue("gray.50", "gray.900")}
      p={6}
      backgroundImage="url('https://via.placeholder.com/1800x1200')"
      backgroundSize="cover"
      backgroundPosition="center"
      position="relative"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.700"
        backdropFilter="blur(10px)"
        zIndex={0}
      />
      
      <Flex
        direction="column"
        align="center"
        justify="center"
        bg="white"
        p={12}
        borderRadius="xl"
        boxShadow="2xl"
        maxW="md"
        w="full"
        zIndex={1}
        position="relative"
      >
        <Icon as={AlertCircle} boxSize={16} color="red.500" mb={6} />
        <Heading mb={4} size="xl" textAlign="center" fontWeight="bold">
          Authentication Required
        </Heading>
        <Text fontSize="lg" color="gray.600" mb={10} textAlign="center">
          Please sign in to access your profile dashboard
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
          fontWeight="bold"
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "xl",
            bgGradient: "linear(to-r, blue.600, teal.600)",
          }}
          _active={{
            transform: "translateY(0)",
          }}
          transition="all 0.3s"
          w="full"
        >
          Sign In
        </Button>
      </Flex>
    </Flex>
  );
}

return (
  <Box
    bg={useColorModeValue("gray.50", "gray.900")}
    minH="100vh"
    pt={8}
    pb={16}
  >
    <Container maxW="container.xl">
      {/* Profile Header */}
      <Box
        bg="white"
        borderRadius="2xl"
        boxShadow="lg"
        overflow="hidden"
        mb={8}
        position="relative"
      >
        {/* Header Background */}
        <Box
          height="160px"
          bgGradient={bgGradient}
          position="relative"
        />
        
        <Box px={{ base: 6, md: 10 }} pb={8} pt={0} position="relative">
          <Flex
            direction={{ base: "column", md: "row" }}
            align={{ base: "center", md: "flex-end" }}
            justify="space-between"
            mb={8}
          >
            <Flex align="center" direction={{ base: "column", md: "row" }}>
              <Avatar
                size={{ base: "xl", md: "2xl" }}
                icon={<Icon as={User} boxSize={{ base: 12, md: 16 }} />}
                bg="white"
                color="blue.500"
                borderWidth="4px"
                borderColor="white"
                boxShadow="lg"
                mt={{ base: "-40px", md: "-70px" }}
                mr={{ base: 0, md: 6 }}
                mb={{ base: 4, md: 0 }}
              />
              
              <VStack
                spacing={1}
                align={{ base: "center", md: "flex-start" }}
                mt={{ base: 0, md: "-25px" }}
              >
                <Heading
                  color="gray.800"
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="700"
                >
                  {userData?.fullName}
                </Heading>
                <Text color="gray.500" fontSize="md" fontWeight="medium">
                  @{userData?.userName}
                </Text>

                <HStack spacing={6} mt={2}>
                  <HStack color="gray.600" spacing={2}>
                    <Icon as={Mail} boxSize={4} />
                    <Text fontSize="sm" fontWeight="medium">{userData?.email}</Text>
                  </HStack>
                  {userData?.phone && (
                    <HStack color="gray.600" spacing={2}>
                      <Icon as={Phone} boxSize={4} />
                      <Text fontSize="sm" fontWeight="medium">{userData?.phone}</Text>
                    </HStack>
                  )}
                </HStack>
              </VStack>
            </Flex>

            <Box mt={{ base: 6, md: "-25px" }}>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  leftIcon={<Icon as={Edit} boxSize={4} />}
                  bgGradient={bgGradient}
                  color="white"
                  size="md"
                  px={6}
                  py={5}
                  _hover={{
                    bgGradient: "linear(to-r, blue.600, teal.600)",
                    transform: "translateY(-2px)",
                    boxShadow: "md",
                  }}
                  _active={{
                    transform: "translateY(0)",
                  }}
                  transition="all 0.2s"
                  borderRadius="lg"
                  fontWeight="medium"
                >
                  Edit Profile
                </Button>
              ) : (
                <Button
                  onClick={cancelEdit}
                  leftIcon={<Icon as={X} boxSize={4} />}
                  variant="outline"
                  color="gray.500"
                  borderColor="gray.300"
                  _hover={{ bg: "gray.50" }}
                  borderRadius="lg"
                  size="md"
                  px={6}
                  py={5}
                  fontWeight="medium"
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Flex>
        </Box>
      </Box>

      {/* Tabs & Content */}
      <Tabs
        variant="unstyled"
        colorScheme="blue"
        isLazy
        onChange={(index) => {
          const tabs = ["personal", "appointments", "reports"];
          setActiveTab(tabs[index]);
        }}
      >
        <TabList
          mb={8}
          gap={1}
          bg="white"
          p={1}
          borderRadius="xl"
          boxShadow="sm"
          position="sticky"
          top="20px"
          zIndex={10}
        >
          {["Personal Info", "Appointments", "Reports"].map((tab, index) => (
            <Tab
              key={tab}
              fontWeight="medium"
              px={6}
              py={4}
              borderRadius="lg"
              flex="1"
              color="gray.500"
              _selected={{
                color: "white",
                bg: "blue.500",
                fontWeight: "600",
              }}
              _hover={{
                bg: "gray.50",
                color: "blue.500",
              }}
              transition="all 0.2s"
            >
              {tab}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {/* Personal Info Tab */}
          <TabPanel px={0}>
            <Card
              bg="white"
              borderRadius="xl"
              boxShadow="lg"
              overflow="hidden"
            >
              <CardBody p={{ base: 6, md: 10 }}>
                <Heading size="md" mb={8} color="gray.800" fontWeight="700">
                  Profile Information
                </Heading>
                <form onSubmit={handleSubmit}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                    <FormControl
                      bg={isEditing ? "white" : "gray.50"}
                      p={4}
                      borderRadius="lg"
                      transition="all 0.2s"
                    >
                      <FormLabel
                        fontSize="sm"
                        fontWeight="bold"
                        color="gray.700"
                        mb={3}
                      >
                        Full Name
                      </FormLabel>
                      {isEditing ? (
                        <Input
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          focusBorderColor="blue.400"
                          borderRadius="lg"
                          borderColor="gray.200"
                          bg="white"
                          size="lg"
                        />
                      ) : (
                        <Text color="gray.800" fontWeight="medium" fontSize="md">
                          {userData?.fullName || "Not specified"}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl
                      bg={isEditing ? "white" : "gray.50"}
                      p={4}
                      borderRadius="lg"
                      transition="all 0.2s"
                    >
                      <FormLabel
                        fontSize="sm"
                        fontWeight="bold"
                        color="gray.700"
                        mb={3}
                      >
                        Username
                      </FormLabel>
                      {isEditing ? (
                        <Input
                          name="userName"
                          value={formData.userName}
                          onChange={handleChange}
                          focusBorderColor="blue.400"
                          borderRadius="lg"
                          borderColor="gray.200"
                          bg="white"
                          size="lg"
                        />
                      ) : (
                        <Text color="gray.800" fontWeight="medium" fontSize="md">
                          {userData?.userName || "Not specified"}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl
                      bg={isEditing ? "white" : "gray.50"}
                      p={4}
                      borderRadius="lg"
                      transition="all 0.2s"
                    >
                      <FormLabel
                        fontSize="sm"
                        fontWeight="bold"
                        color="gray.700"
                        mb={3}
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
                          borderRadius="lg"
                          borderColor="gray.200"
                          bg="white"
                          size="lg"
                        />
                      ) : (
                        <Text color="gray.800" fontWeight="medium" fontSize="md">
                          {userData?.email || "Not specified"}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl
                      bg={isEditing ? "white" : "gray.50"}
                      p={4}
                      borderRadius="lg"
                      transition="all 0.2s"
                    >
                      <FormLabel
                        fontSize="sm"
                        fontWeight="bold"
                        color="gray.700"
                        mb={3}
                      >
                        Phone
                      </FormLabel>
                      {isEditing ? (
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          focusBorderColor="blue.400"
                          borderRadius="lg"
                          borderColor="gray.200"
                          bg="white"
                          size="lg"
                        />
                      ) : (
                        <Text color="gray.800" fontWeight="medium" fontSize="md">
                          {userData?.phone || "Not specified"}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl
                      bg={isEditing ? "white" : "gray.50"}
                      p={4}
                      borderRadius="lg"
                      transition="all 0.2s"
                    >
                      <FormLabel
                        fontSize="sm"
                        fontWeight="bold"
                        color="gray.700"
                        mb={3}
                      >
                        Address
                      </FormLabel>
                      {isEditing ? (
                        <Input
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          focusBorderColor="blue.400"
                          borderRadius="lg"
                          borderColor="gray.200"
                          bg="white"
                          size="lg"
                        />
                      ) : (
                        <Text color="gray.800" fontWeight="medium" fontSize="md">
                          {userData?.address || "Not specified"}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl
                      bg={isEditing ? "white" : "gray.50"}
                      p={4}
                      borderRadius="lg"
                      transition="all 0.2s"
                    >
                      <FormLabel
                        fontSize="sm"
                        fontWeight="bold"
                        color="gray.700"
                        mb={3}
                      >
                        Gender
                      </FormLabel>
                      {isEditing ? (
                        <Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          focusBorderColor="blue.400"
                          borderRadius="lg"
                          borderColor="gray.200"
                          bg="white"
                          size="lg"
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
                        <Text color="gray.800" fontWeight="medium" fontSize="md">
                          {userData?.gender || "Not specified"}
                        </Text>
                      )}
                    </FormControl>
                  </SimpleGrid>

                  {isEditing && (
                    <Button
                      mt={10}
                      type="submit"
                      bgGradient={bgGradient}
                      color="white"
                      size="lg"
                      leftIcon={<Icon as={Save} boxSize={5} />}
                      px={10}
                      py={6}
                      borderRadius="lg"
                      _hover={{
                        bgGradient: "linear(to-r, blue.600, teal.600)",
                        transform: "translateY(-2px)",
                        boxShadow: "md",
                      }}
                      _active={{
                        transform: "translateY(0)",
                      }}
                      transition="all 0.2s"
                      fontWeight="bold"
                    >
                      Save Changes
                    </Button>
                  )}
                </form>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Appointments Tab */}
          <TabPanel px={0}>
            <Card
              bg="white"
              borderRadius="xl"
              boxShadow="lg"
              overflow="hidden"
            >
              <CardBody p={{ base: 6, md: 10 }}>
                <Flex justify="space-between" align="center" mb={8}>
                  <Heading size="md" color="gray.800" fontWeight="700">
                    Your Appointments
                  </Heading>
                  <Button
                    onClick={() => navigate("/book-appointment")}
                    bgGradient={bgGradient}
                    color="white"
                    size="md"
                    leftIcon={<Icon as={Calendar} boxSize={4} />}
                    px={6}
                    _hover={{
                      bgGradient: "linear(to-r, blue.600, teal.600)",
                      transform: "translateY(-2px)",
                      boxShadow: "md",
                    }}
                    _active={{
                      transform: "translateY(0)",
                    }}
                    transition="all 0.2s"
                    borderRadius="lg"
                    fontWeight="medium"
                  >
                    Schedule New
                  </Button>
                </Flex>

                {appointmentsLoading ? (
                  <VStack spacing={6} align="stretch">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} height="80px" borderRadius="lg" />
                    ))}
                  </VStack>
                ) : (
                  <TableContainer 
                    borderRadius="xl" 
                    borderWidth="1px"
                    borderColor="gray.200"
                    boxShadow="sm"
                    overflow="hidden"
                  >
                    <Table variant="simple">
                      <Thead bg="gray.50">
                        <Tr>
                          <Th py={4} borderColor="gray.100">Title</Th>
                          <Th py={4} borderColor="gray.100">Hospital</Th>
                          <Th py={4} borderColor="gray.100">Date & Time</Th>
                          <Th py={4} borderColor="gray.100">Status</Th>
                          <Th py={4} borderColor="gray.100">Payment Status</Th>
                          <Th py={4} borderColor="gray.100">Actions</Th>
                        </Tr>
                      </Thead>

                      <Tbody>
                        {appointments && appointments.length > 0 ? (
                          appointments.map((appointment) => (
                            <Tr key={appointment._id}>
                              <Td py={4} borderColor="gray.100" fontWeight="medium">
                                Doctor Appointment
                              </Td>
                              <Td py={4} borderColor="gray.100">
                                {formatDate(appointment.date)}
                              </Td>
                              <Td py={4} borderColor="gray.100">
                                {appointment.hospital.name}
                              </Td>
                              <Td py={4} borderColor="gray.100">
                                <Tag
                                  colorScheme={getStatusColor(
                                    appointment.status
                                  )}
                                  borderRadius="full"
                                  size="md"
                                  py={1}
                                  px={3}
                                  fontWeight="medium"
                                >
                                  {appointment.status}
                                </Tag>
                              </Td>
                              <Td py={4} borderColor="gray.100">
                                <Tag
                                  colorScheme={
                                    appointment.paymentStatus === "paid"
                                      ? "green"
                                      : "gray"
                                  }
                                  borderRadius="full"
                                  size="md"
                                  py={1}
                                  px={3}
                                  fontWeight="medium"
                                >
                                  {appointment.paymentStatus}
                                </Tag>
                              </Td>
                              <Td py={4} borderColor="gray.100">
                                <HStack spacing={2}>
                                  <Button
                                    size="sm"
                                    colorScheme="blue"
                                    variant="solid"
                                    borderRadius="md"
                                    fontWeight="medium"
                                  >
                                    View
                                  </Button>
                                  {appointment.status !== "completed" &&
                                    appointment.status !== "cancelled" && (
                                      <Button
                                        size="sm"
                                        colorScheme="red"
                                        variant="ghost"
                                        borderRadius="md"
                                        fontWeight="medium"
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
                            <Td
                              colSpan={6}
                              textAlign="center"
                              py={16}
                              borderColor="gray.100"
                            >
                              <VStack spacing={6}>
                                <Icon
                                  as={Calendar}
                                  boxSize={16}
                                  color="gray.300"
                                />
                                <Heading size="md" color="gray.600" fontWeight="medium">
                                  No appointments found
                                </Heading>
                                <Text color="gray.500" maxW="md" textAlign="center" mb={2}>
                                  You don't have any appointments scheduled yet. Book your first appointment.
                                </Text>
                                <Button
                                  size="md"
                                  bgGradient={bgGradient}
                                  color="white"
                                  px={8}
                                  py={6}
                                  onClick={() => navigate("/book-appointment")}
                                  borderRadius="lg"
                                  _hover={{
                                    bgGradient: "linear(to-r, blue.600, teal.600)",
                                    transform: "translateY(-2px)",
                                    boxShadow: "md",
                                  }}
                                  transition="all 0.2s"
                                  fontWeight="medium"
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
                  <Flex justify="space-between" align="center" mt={8} px={2}>
                    <Text color="gray.500" fontSize="sm" fontWeight="medium">
                      Showing {appointments.length} appointments
                    </Text>
                    <Button
                      variant="link"
                      colorScheme="blue"
                      size="sm"
                      rightIcon={<Icon as={ArrowRight} boxSize={4} />}
                      fontWeight="medium"
                    >
                      View All Appointments
                    </Button>
                  </Flex>
                )}
              </CardBody>
            </Card>
          </TabPanel>

          {/* Reports Tab */}
          <TabPanel px={0}>
            <Card
              bg="white"
              borderRadius="xl"
              boxShadow="lg"
              overflow="hidden"
            >
              <CardBody p={{ base: 6, md: 10 }}>
                <Flex justify="space-between" align="center" mb={8}>
                  <Heading size="md" color="gray.800" fontWeight="700">
                    Your Medical Reports
                  </Heading>
                </Flex>

                {/* Medical Reports Table */}
                <TableContainer 
                  borderRadius="xl" 
                  borderWidth="1px"
                  borderColor="gray.200"
                  boxShadow="sm"
                  overflow="hidden"
                >
                  <Table variant="simple">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th py={4} borderColor="gray.100">Report Title</Th>
                        <Th py={4} borderColor="gray.100">Hospital</Th>
                        <Th py={4} borderColor="gray.100">Doctor</Th>
                        <Th py={4} borderColor="gray.100">Date</Th>
                        <Th py={4} borderColor="gray.100">Actions</Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      {reports && reports.length > 0 ? (
                        reports.map((report) => (
                          <Tr key={report._id}>
                            <Td py={4} borderColor="gray.100" fontWeight="medium">
                              {report.reportTitle}
                            </Td>
                            <Td py={4} borderColor="gray.100">
                              {report.hospital?.name || "N/A"}
                            </Td>
                            <Td py={4} borderColor="gray.100">
                              {report.doctorName || "N/A"}
                            </Td>
                            <Td py={4} borderColor="gray.100">
                              {formatDate(report.createdAt)}
                            </Td>
                            <Td py={4} borderColor="gray.100">
                              <HStack spacing={3}>
                                <Button
                                  size="sm"
                                  bgGradient={bgGradient}
                                  color="white"
                                  leftIcon={<Icon as={Download} boxSize={4} />}
                                  onClick={() =>
                                    handleDownloadReport(report._id)
                                  }
                                  borderRadius="md"
                                  _hover={{
                                    bgGradient: "linear(to-r, blue.600, teal.600)",
                                  }}
                                  fontWeight="medium"
                                >
                                  Download
                                </Button>
                                <Button
                                  size="sm"
                                  colorScheme="gray"
                                  variant="outline"
                                  leftIcon={<Icon as={Eye} boxSize={4} />}
                                  as="a"
                                  href={report.reportFile}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  borderRadius="md"
                                  fontWeight="medium"
                                >
                                  View
                                </Button>
                              </HStack>
                            </Td>
                          </Tr>
                        ))
                      ) : (
                        <Tr>
                          <Td
                            colSpan={5}
                            textAlign="center"
                            py={16}
                            borderColor="gray.100"
                          >
                            <VStack spacing={6}>
                              <Icon
                                as={FileText}
                                boxSize={16}
                                color="gray.300"
                              />
                              <Heading size="md" color="gray.600" fontWeight="medium">
                                No medical reports found
                              </Heading>
                              <Text color="gray.500" maxW="md" textAlign="center">
                                Your medical reports and test results will
                                appear here when available from your healthcare provider
                              </Text>
                            </VStack>
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>

                {reportsLoading && (
                  <Flex
                    justify="center"
                    align="center"
                    py={10}
                    bg="gray.50"
                    borderRadius="xl"
                    mt={8}
                  >
                    <Spinner size="md" color="blue.500" thickness="3px" />
                    <Text ml={4} color="gray.600" fontWeight="medium">
                      Loading your medical reports...
                    </Text>
                  </Flex>
                )}

                {reports && reports.length > 0 && (
                  <Flex justify="space-between" align="center" mt={8} px={2}>
                    <Text color="gray.500" fontSize="sm" fontWeight="medium">
                      Showing {reports.length} reports
                    </Text>
                  </Flex>
                )}
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  </Box>
);
};

export default UserProfile;
