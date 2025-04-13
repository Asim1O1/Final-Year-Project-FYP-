import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User, Mail, Phone, Calendar, Edit, Save, X, AlertCircle, Eye, FileText, ArrowRight, Clock, MapPin, Shield, Award, Activity, Bell, Settings, Download, ChevronRight, CheckCircle, XCircle, AlertTriangle, Clipboard, Heart } from 'lucide-react';
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
  CardHeader,
  CardFooter,
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
  Badge,
  Tooltip,
  Image,
  Grid,
  GridItem,
  Stack,
  AvatarBadge,
  useDisclosure,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

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
      position: "top",
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

  // Get status icon for appointments
  const getStatusIcon = (status) => {
    const statusIcons = {
      scheduled: Calendar,
      completed: CheckCircle,
      cancelled: XCircle,
      pending: Clock,
      default: AlertCircle,
    };
    return statusIcons[status?.toLowerCase()] || statusIcons.default;
  };

  // UI Colors and Styles
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("teal.600", "teal.800");
  const primaryColor = useColorModeValue("teal.600", "teal.300");
  const secondaryColor = useColorModeValue("purple.600", "purple.300");
  const accentColor = useColorModeValue("pink.500", "pink.300");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const highlightBg = useColorModeValue("teal.50", "teal.900");
  const statBg1 = useColorModeValue("teal.50", "teal.900");
  const statBg2 = useColorModeValue("purple.50", "purple.900");
  const statBg3 = useColorModeValue("pink.50", "pink.900");

  // Authentication check
  if (!isAuthenticated) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        minH="100vh"
        bg={bgColor}
        p={6}
        backgroundImage="url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80')"
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
          bg={cardBg}
          p={12}
          borderRadius="xl"
          boxShadow="2xl"
          maxW="md"
          w="full"
          zIndex={1}
          position="relative"
        >
          <Icon as={AlertCircle} boxSize={16} color="red.500" mb={6} />
          <Heading mb={4} size="xl" textAlign="center" fontWeight="bold" color={textColor}>
            Authentication Required
          </Heading>
          <Text fontSize="lg" color={mutedColor} mb={10} textAlign="center">
            Please sign in to access your personal health dashboard
          </Text>
          <Button
            as="a"
            href="/login"
            size="lg"
            bg={primaryColor}
            color="white"
            px={12}
            py={6}
            borderRadius="full"
            fontWeight="bold"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "xl",
              bg: "teal.700",
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
      bg={bgColor}
      minH="100vh"
      pt={8}
      pb={16}
    >
      <Container maxW="container.xl">
        {/* Profile Header */}
        <Box
          bg={cardBg}
          borderRadius="2xl"
          boxShadow="xl"
          overflow="hidden"
          mb={8}
          position="relative"
        >
          {/* Header Background */}
          <Box
            height="180px"
            bgGradient="linear(to-r, teal.500, purple.500)"
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bgImage="url('https://images.unsplash.com/photo-1504439468489-c8920d796a29?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80')"
              bgSize="cover"
              bgPosition="center"
              opacity="0.2"
            />
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bgGradient="linear(to-r, teal.600, purple.600)"
              opacity="0.9"
            />
          </Box>
          
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
                  src={userData?.profileImage || "https://bit.ly/broken-link"}
                  name={userData?.fullName}
                  bg="white"
                  color={primaryColor}
                  borderWidth="4px"
                  borderColor="white"
                  boxShadow="xl"
                  mt={{ base: "-40px", md: "-70px" }}
                  mr={{ base: 0, md: 6 }}
                  mb={{ base: 4, md: 0 }}
                >
                  <AvatarBadge boxSize="1.25em" bg="green.500" border="4px solid white" />
                </Avatar>
                
                <VStack
                  spacing={1}
                  align={{ base: "center", md: "flex-start" }}
                  mt={{ base: 0, md: "-25px" }}
                >
                  <Heading
                    color={textColor}
                    fontSize={{ base: "2xl", md: "3xl" }}
                    fontWeight="700"
                  >
                    {userData?.fullName}
                  </Heading>
                  <Text color={mutedColor} fontSize="md" fontWeight="medium">
                    @{userData?.userName}
                  </Text>

                  <HStack spacing={6} mt={2}>
                    <HStack color={mutedColor} spacing={2}>
                      <Icon as={Mail} boxSize={4} />
                      <Text fontSize="sm" fontWeight="medium">{userData?.email}</Text>
                    </HStack>
                    {userData?.phone && (
                      <HStack color={mutedColor} spacing={2}>
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
                    bg={primaryColor}
                    color="white"
                    size="md"
                    px={6}
                    py={5}
                    _hover={{
                      bg: "teal.700",
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
                    color={mutedColor}
                    borderColor={borderColor}
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

            {/* Stats Cards */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mt={6}>
              <Stat
                px={6}
                py={4}
                bg={statBg1}
                borderRadius="lg"
                boxShadow="sm"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Flex justify="space-between" align="center">
                  <Box>
                    <StatLabel color={mutedColor} fontWeight="medium">Appointments</StatLabel>
                    <StatNumber fontSize="3xl" fontWeight="bold" color={primaryColor}>
                      {appointments?.length || 0}
                    </StatNumber>
                    <StatHelpText mb={0}>
                      <StatArrow type="increase" />
                      23% from last month
                    </StatHelpText>
                  </Box>
                  <Flex
                    w="50px"
                    h="50px"
                    align="center"
                    justify="center"
                    borderRadius="full"
                    bg="teal.100"
                    color="teal.700"
                  >
                    <Icon as={Calendar} boxSize={6} />
                  </Flex>
                </Flex>
              </Stat>

              <Stat
                px={6}
                py={4}
                bg={statBg2}
                borderRadius="lg"
                boxShadow="sm"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Flex justify="space-between" align="center">
                  <Box>
                    <StatLabel color={mutedColor} fontWeight="medium">Medical Reports</StatLabel>
                    <StatNumber fontSize="3xl" fontWeight="bold" color={secondaryColor}>
                      {reports?.length || 0}
                    </StatNumber>
                    <StatHelpText mb={0}>
                      <StatArrow type="increase" />
                      12% from last month
                    </StatHelpText>
                  </Box>
                  <Flex
                    w="50px"
                    h="50px"
                    align="center"
                    justify="center"
                    borderRadius="full"
                    bg="purple.100"
                    color="purple.700"
                  >
                    <Icon as={FileText} boxSize={6} />
                  </Flex>
                </Flex>
              </Stat>

              <Stat
                px={6}
                py={4}
                bg={statBg3}
                borderRadius="lg"
                boxShadow="sm"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Flex justify="space-between" align="center">
                  <Box>
                    <StatLabel color={mutedColor} fontWeight="medium">Health Score</StatLabel>
                    <StatNumber fontSize="3xl" fontWeight="bold" color={accentColor}>
                      85%
                    </StatNumber>
                    <StatHelpText mb={0}>
                      <StatArrow type="increase" />
                      7% from last check
                    </StatHelpText>
                  </Box>
                  <Flex
                    w="50px"
                    h="50px"
                    align="center"
                    justify="center"
                    borderRadius="full"
                    bg="pink.100"
                    color="pink.700"
                  >
                    <Icon as={Heart} boxSize={6} />
                  </Flex>
                </Flex>
              </Stat>
            </SimpleGrid>
          </Box>
        </Box>

        {/* Tabs & Content */}
        <Tabs
          variant="soft-rounded"
          colorScheme="teal"
          isLazy
          onChange={(index) => {
            const tabs = ["personal", "appointments", "reports"];
            setActiveTab(tabs[index]);
          }}
        >
          <TabList
            mb={8}
            gap={2}
            bg={cardBg}
            p={2}
            borderRadius="xl"
            boxShadow="sm"
            position="sticky"
            top="20px"
            zIndex={10}
            borderWidth="1px"
            borderColor={borderColor}
            overflowX="auto"
            css={{
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              'scrollbarWidth': 'none',
            }}
          >
            <Tab
              fontWeight="medium"
              px={6}
              py={4}
              borderRadius="lg"
              color={mutedColor}
              _selected={{
                color: "white",
                bg: primaryColor,
                fontWeight: "600",
              }}
              _hover={{
                bg: "gray.100",
                color: primaryColor,
              }}
              transition="all 0.2s"
              display="flex"
              alignItems="center"
            >
              <Icon as={User} mr={2} boxSize={5} />
              Personal Info
            </Tab>
            <Tab
              fontWeight="medium"
              px={6}
              py={4}
              borderRadius="lg"
              color={mutedColor}
              _selected={{
                color: "white",
                bg: primaryColor,
                fontWeight: "600",
              }}
              _hover={{
                bg: "gray.100",
                color: primaryColor,
              }}
              transition="all 0.2s"
              display="flex"
              alignItems="center"
            >
              <Icon as={Calendar} mr={2} boxSize={5} />
              Appointments
            </Tab>
            <Tab
              fontWeight="medium"
              px={6}
              py={4}
              borderRadius="lg"
              color={mutedColor}
              _selected={{
                color: "white",
                bg: primaryColor,
                fontWeight: "600",
              }}
              _hover={{
                bg: "gray.100",
                color: primaryColor,
              }}
              transition="all 0.2s"
              display="flex"
              alignItems="center"
            >
              <Icon as={FileText} mr={2} boxSize={5} />
              Medical Reports
            </Tab>
          </TabList>

          <TabPanels>
            {/* Personal Info Tab */}
            <TabPanel px={0}>
              <Card
                bg={cardBg}
                borderRadius="xl"
                boxShadow="xl"
                overflow="hidden"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <CardHeader 
                  bg={highlightBg} 
                  py={6} 
                  px={8}
                  borderBottomWidth="1px"
                  borderColor={borderColor}
                >
                  <Flex align="center">
                    <Icon as={User} color={primaryColor} boxSize={6} mr={3} />
                    <Heading size="md" color={primaryColor} fontWeight="700">
                      Profile Information
                    </Heading>
                  </Flex>
                </CardHeader>
                
                <CardBody p={{ base: 6, md: 10 }}>
                  <form onSubmit={handleSubmit}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                      <FormControl
                        bg={isEditing ? "white" : "gray.50"}
                        p={5}
                        borderRadius="lg"
                        transition="all 0.2s"
                        borderWidth="1px"
                        borderColor={borderColor}
                        _hover={isEditing ? { borderColor: primaryColor } : {}}
                      >
                        <FormLabel
                          fontSize="sm"
                          fontWeight="bold"
                          color={mutedColor}
                          mb={3}
                          display="flex"
                          alignItems="center"
                        >
                          <Icon as={User} mr={2} boxSize={4} color={primaryColor} />
                          Full Name
                        </FormLabel>
                        {isEditing ? (
                          <Input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            focusBorderColor="teal.400"
                            borderRadius="lg"
                            borderColor="gray.200"
                            bg="white"
                            size="lg"
                            _hover={{ borderColor: "teal.300" }}
                          />
                        ) : (
                          <Text color={textColor} fontWeight="medium" fontSize="md">
                            {userData?.fullName || "Not specified"}
                          </Text>
                        )}
                      </FormControl>

                      <FormControl
                        bg={isEditing ? "white" : "gray.50"}
                        p={5}
                        borderRadius="lg"
                        transition="all 0.2s"
                        borderWidth="1px"
                        borderColor={borderColor}
                        _hover={isEditing ? { borderColor: primaryColor } : {}}
                      >
                        <FormLabel
                          fontSize="sm"
                          fontWeight="bold"
                          color={mutedColor}
                          mb={3}
                          display="flex"
                          alignItems="center"
                        >
                          <Icon as={User} mr={2} boxSize={4} color={primaryColor} />
                          Username
                        </FormLabel>
                        {isEditing ? (
                          <Input
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            focusBorderColor="teal.400"
                            borderRadius="lg"
                            borderColor="gray.200"
                            bg="white"
                            size="lg"
                            _hover={{ borderColor: "teal.300" }}
                          />
                        ) : (
                          <Text color={textColor} fontWeight="medium" fontSize="md">
                            {userData?.userName || "Not specified"}
                          </Text>
                        )}
                      </FormControl>

                      <FormControl
                        bg={isEditing ? "white" : "gray.50"}
                        p={5}
                        borderRadius="lg"
                        transition="all 0.2s"
                        borderWidth="1px"
                        borderColor={borderColor}
                        _hover={isEditing ? { borderColor: primaryColor } : {}}
                      >
                        <FormLabel
                          fontSize="sm"
                          fontWeight="bold"
                          color={mutedColor}
                          mb={3}
                          display="flex"
                          alignItems="center"
                        >
                          <Icon as={Mail} mr={2} boxSize={4} color={primaryColor} />
                          Email
                        </FormLabel>
                        {isEditing ? (
                          <Input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            focusBorderColor="teal.400"
                            type="email"
                            borderRadius="lg"
                            borderColor="gray.200"
                            bg="white"
                            size="lg"
                            _hover={{ borderColor: "teal.300" }}
                          />
                        ) : (
                          <Text color={textColor} fontWeight="medium" fontSize="md">
                            {userData?.email || "Not specified"}
                          </Text>
                        )}
                      </FormControl>

                      <FormControl
                        bg={isEditing ? "white" : "gray.50"}
                        p={5}
                        borderRadius="lg"
                        transition="all 0.2s"
                        borderWidth="1px"
                        borderColor={borderColor}
                        _hover={isEditing ? { borderColor: primaryColor } : {}}
                      >
                        <FormLabel
                          fontSize="sm"
                          fontWeight="bold"
                          color={mutedColor}
                          mb={3}
                          display="flex"
                          alignItems="center"
                        >
                          <Icon as={Phone} mr={2} boxSize={4} color={primaryColor} />
                          Phone
                        </FormLabel>
                        {isEditing ? (
                          <Input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            focusBorderColor="teal.400"
                            borderRadius="lg"
                            borderColor="gray.200"
                            bg="white"
                            size="lg"
                            _hover={{ borderColor: "teal.300" }}
                          />
                        ) : (
                          <Text color={textColor} fontWeight="medium" fontSize="md">
                            {userData?.phone || "Not specified"}
                          </Text>
                        )}
                      </FormControl>

                      <FormControl
                        bg={isEditing ? "white" : "gray.50"}
                        p={5}
                        borderRadius="lg"
                        transition="all 0.2s"
                        borderWidth="1px"
                        borderColor={borderColor}
                        _hover={isEditing ? { borderColor: primaryColor } : {}}
                      >
                        <FormLabel
                          fontSize="sm"
                          fontWeight="bold"
                          color={mutedColor}
                          mb={3}
                          display="flex"
                          alignItems="center"
                        >
                          <Icon as={MapPin} mr={2} boxSize={4} color={primaryColor} />
                          Address
                        </FormLabel>
                        {isEditing ? (
                          <Input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            focusBorderColor="teal.400"
                            borderRadius="lg"
                            borderColor="gray.200"
                            bg="white"
                            size="lg"
                            _hover={{ borderColor: "teal.300" }}
                          />
                        ) : (
                          <Text color={textColor} fontWeight="medium" fontSize="md">
                            {userData?.address || "Not specified"}
                          </Text>
                        )}
                      </FormControl>

                      <FormControl
                        bg={isEditing ? "white" : "gray.50"}
                        p={5}
                        borderRadius="lg"
                        transition="all 0.2s"
                        borderWidth="1px"
                        borderColor={borderColor}
                        _hover={isEditing ? { borderColor: primaryColor } : {}}
                      >
                        <FormLabel
                          fontSize="sm"
                          fontWeight="bold"
                          color={mutedColor}
                          mb={3}
                          display="flex"
                          alignItems="center"
                        >
                          <Icon as={User} mr={2} boxSize={4} color={primaryColor} />
                          Gender
                        </FormLabel>
                        {isEditing ? (
                          <Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            focusBorderColor="teal.400"
                            borderRadius="lg"
                            borderColor="gray.200"
                            bg="white"
                            size="lg"
                            _hover={{ borderColor: "teal.300" }}
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
                          <Text color={textColor} fontWeight="medium" fontSize="md" textTransform="capitalize">
                            {userData?.gender || "Not specified"}
                          </Text>
                        )}
                      </FormControl>
                    </SimpleGrid>

                    {isEditing && (
                      <Button
                        mt={10}
                        type="submit"
                        bg={primaryColor}
                        color="white"
                        size="lg"
                        leftIcon={<Icon as={Save} boxSize={5} />}
                        px={10}
                        py={6}
                        borderRadius="lg"
                        _hover={{
                          bg: "teal.700",
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
                bg={cardBg}
                borderRadius="xl"
                boxShadow="xl"
                overflow="hidden"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <CardHeader 
                  bg={highlightBg} 
                  py={6} 
                  px={8}
                  borderBottomWidth="1px"
                  borderColor={borderColor}
                >
                  <Flex justify="space-between" align="center">
                    <Flex align="center">
                      <Icon as={Calendar} color={primaryColor} boxSize={6} mr={3} />
                      <Heading size="md" color={primaryColor} fontWeight="700">
                        Your Appointments
                      </Heading>
                    </Flex>
                    <Button
                      onClick={() => navigate("/book-appointment")}
                      bg={primaryColor}
                      color="white"
                      size="md"
                      leftIcon={<Icon as={Calendar} boxSize={4} />}
                      px={6}
                      _hover={{
                        bg: "teal.700",
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
                </CardHeader>

                <CardBody p={{ base: 6, md: 8 }}>
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
                      borderColor={borderColor}
                      boxShadow="sm"
                      overflow="hidden"
                    >
                      <Table variant="simple">
                        <Thead bg="gray.50">
                          <Tr>
                            <Th py={4} borderColor="gray.100">Title</Th>
                            <Th py={4} borderColor="gray.100">Date & Time</Th>
                            <Th py={4} borderColor="gray.100">Hospital</Th>
                            <Th py={4} borderColor="gray.100">Status</Th>
                            <Th py={4} borderColor="gray.100">Payment Status</Th>
                            <Th py={4} borderColor="gray.100">Actions</Th>
                          </Tr>
                        </Thead>

                        <Tbody>
                          {appointments && appointments.length > 0 ? (
                            appointments.map((appointment) => (
                              <Tr key={appointment._id} _hover={{ bg: "gray.50" }}>
                                <Td py={4} borderColor="gray.100" fontWeight="medium" color={textColor}>
                                  Doctor Appointment
                                </Td>
                                <Td py={4} borderColor="gray.100" color={mutedColor}>
                                  {formatDate(appointment.date)}
                                </Td>
                                <Td py={4} borderColor="gray.100" color={mutedColor}>
                                  {appointment.hospital?.name || "N/A"}
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
                                    <Flex align="center">
                                      <Icon as={getStatusIcon(appointment.status)} boxSize={3} mr={1} />
                                      {appointment.status}
                                    </Flex>
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
                                      colorScheme="teal"
                                      variant="solid"
                                      borderRadius="md"
                                      fontWeight="medium"
                                      leftIcon={<Icon as={Eye} boxSize={3} />}
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
                                          leftIcon={<Icon as={X} boxSize={3} />}
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
                                  <Heading size="md" color={mutedColor} fontWeight="medium">
                                    No appointments found
                                  </Heading>
                                  <Text color="gray.500" maxW="md" textAlign="center" mb={2}>
                                    You don't have any appointments scheduled yet. Book your first appointment.
                                  </Text>
                                  <Button
                                    size="md"
                                    bg={primaryColor}
                                    color="white"
                                    px={8}
                                    py={6}
                                    onClick={() => navigate("/book-appointment")}
                                    borderRadius="lg"
                                    _hover={{
                                      bg: "teal.700",
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
                      <Text color={mutedColor} fontSize="sm" fontWeight="medium">
                        Showing {appointments.length} appointments
                      </Text>
                      <Button
                        variant="link"
                        colorScheme="teal"
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
                bg={cardBg}
                borderRadius="xl"
                boxShadow="xl"
                overflow="hidden"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <CardHeader 
                  bg={highlightBg} 
                  py={6} 
                  px={8}
                  borderBottomWidth="1px"
                  borderColor={borderColor}
                >
                  <Flex align="center">
                    <Icon as={FileText} color={primaryColor} boxSize={6} mr={3} />
                    <Heading size="md" color={primaryColor} fontWeight="700">
                      Your Medical Reports
                    </Heading>
                  </Flex>
                </CardHeader>

                <CardBody p={{ base: 6, md: 8 }}>
                  {/* Medical Reports Table */}
                  <TableContainer 
                    borderRadius="xl" 
                    borderWidth="1px"
                    borderColor={borderColor}
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
                            <Tr key={report._id} _hover={{ bg: "gray.50" }}>
                              <Td py={4} borderColor="gray.100" fontWeight="medium" color={textColor}>
                                {report.reportTitle}
                              </Td>
                              <Td py={4} borderColor="gray.100" color={mutedColor}>
                                {report.hospital?.name || "N/A"}
                              </Td>
                              <Td py={4} borderColor="gray.100" color={mutedColor}>
                                {report.doctorName || "N/A"}
                              </Td>
                              <Td py={4} borderColor="gray.100" color={mutedColor}>
                                {formatDate(report.createdAt)}
                              </Td>
                              <Td py={4} borderColor="gray.100">
                                <HStack spacing={3}>
                                  <Button
                                    size="sm"
                                    bg={primaryColor}
                                    color="white"
                                    leftIcon={<Icon as={Download} boxSize={4} />}
                                    onClick={() =>
                                      handleDownloadReport(report._id)
                                    }
                                    borderRadius="md"
                                    _hover={{
                                      bg: "teal.700",
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
                                <Heading size="md" color={mutedColor} fontWeight="medium">
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
                      <Spinner size="md" color="teal.500" thickness="3px" />
                      <Text ml={4} color={mutedColor} fontWeight="medium">
                        Loading your medical reports...
                      </Text>
                    </Flex>
                  )}

                  {reports && reports.length > 0 && (
                    <Flex justify="space-between" align="center" mt={8} px={2}>
                      <Text color={mutedColor} fontSize="sm" fontWeight="medium">
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