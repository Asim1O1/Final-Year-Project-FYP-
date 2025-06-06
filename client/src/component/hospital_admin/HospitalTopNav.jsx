import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarBadge,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomLoader from "../common/CustomSpinner";

import { notification } from "antd";
import { User2Icon } from "lucide-react";
import { fetchUserById } from "../../features/user/userSlice";

export const HospitalTopNav = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoadingProfile, setIsLoadingProfile] = useState(true); // Start with loading true
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [profileData, setProfileData] = useState(null);

  const currentAdmin = useSelector((state) => state?.auth?.user?.data);
  const adminId = currentAdmin?._id;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Fetch profile data on component mount
    const fetchInitialProfile = async () => {
      if (adminId) {
        try {
          const result = await dispatch(fetchUserById(adminId)).unwrap();
          setProfileData(result.data || result);
        } catch (error) {
          console.error("Failed to load profile:", error);
        } finally {
          setIsLoadingProfile(false);
          setIsInitialLoad(false);
        }
      } else {
        setIsLoadingProfile(false);
        setIsInitialLoad(false);
      }
    };

    fetchInitialProfile();

    return () => clearInterval(timer);
  }, [adminId, dispatch]);

  const handleProfileClick = async () => {
    if (!adminId) {
      notification.error({
        message: "Profile Error",
        description: "No admin ID found. Please try logging in again.",
        placement: "topRight",
        duration: 5,
      });
      return;
    }

    try {
      setIsLoadingProfile(true);
      const result = await dispatch(fetchUserById(adminId)).unwrap();
      setProfileData(result.data || result);
      onOpen();
    } catch (error) {
      notification.error({
        message: "Failed to load profile",
        description: error.message || "Could not retrieve profile information",
        placement: "topRight",
        duration: 5,
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Merge data with fallbacks
  const mergedProfileData = {
    ...(currentAdmin?.profile || {}),
    ...(profileData || {}),
    fullName:
      profileData?.fullName || currentAdmin?.profile?.fullName || "Loading...",
    role: profileData?.role || currentAdmin?.profile?.role || "Administrator",
    email:
      profileData?.email || currentAdmin?.profile?.email || "user@example.com",
    avatar: profileData?.avatar || currentAdmin?.profile?.avatar,
  };

  return (
    <Flex
      bg="white"
      px={8}
      py={4}
      borderBottom="1px"
      borderColor="gray.200"
      justify="space-between"
      align="center"
      position="sticky"
      top={0}
      zIndex={10}
      boxShadow="sm"
    >
      {/* Left side - Hospital name and date */}
      <Flex alignItems="center">
        <Text
          color="gray.500"
          fontSize="sm"
          ml={2}
          display={["none", null, "block"]}
        >
          {currentTime.toLocaleDateString(undefined, {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </Text>
      </Flex>

      {/* Right Section - Actions and Profile */}
      <HStack spacing={4}>
        {/* Profile Menu */}
        <Menu>
          <Tooltip label="Your Profile" placement="bottom">
            <MenuButton
              as={Box}
              _hover={{ cursor: "pointer" }}
              transition="all 0.2s"
            >
              <HStack spacing={2}>
                {isLoadingProfile ? (
                  <CustomLoader size="sm" thickness="2px" color="blue.500" />
                ) : (
                  <>
                    <Avatar
                      size="sm"
                      name={mergedProfileData?.fullName}
                      src={mergedProfileData?.avatar}
                      bg="teal.500"
                      _hover={{ transform: "scale(1.05)" }}
                      transition="all 0.2s"
                    >
                      <AvatarBadge
                        boxSize="1em"
                        bg="green.500"
                        border="2px solid white"
                      />
                    </Avatar>
                    <Box
                      display={{ base: "none", md: "block" }}
                      textAlign="left"
                    >
                      <Text fontWeight="medium" fontSize="sm">
                        {mergedProfileData?.fullName || "User"}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {mergedProfileData?.role || "Administrator"}
                      </Text>
                    </Box>
                    <ChevronDownIcon />
                  </>
                )}
              </HStack>
            </MenuButton>
          </Tooltip>
          <MenuList
            shadow="lg"
            border="1px solid"
            borderColor="gray.200"
            py={2}
            minW="200px"
          >
            <VStack px={3} pb={3} pt={1} align="center">
              <Avatar
                size="md"
                name={mergedProfileData?.fullName}
                src={mergedProfileData?.avatar}
                bg="teal.500"
              />
              <Text fontWeight="medium" noOfLines={1}>
                {mergedProfileData?.fullName || "User"}
              </Text>
              <Text fontSize="xs" color="gray.500" noOfLines={1} mt="-1">
                {mergedProfileData?.email || "user@example.com"}
              </Text>
            </VStack>
            <MenuDivider />
            <MenuItem
              icon={<Icon as={User2Icon} />}
              onClick={handleProfileClick}
            >
              My Profile
            </MenuItem>
            <MenuDivider />
          </MenuList>
        </Menu>
      </HStack>

      {/* Enhanced Profile Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay bg="blackAlpha.200" backdropFilter="blur(3px)" />
        <ModalContent borderRadius="md" overflow="hidden" boxShadow="lg">
          <Box
            h="20"
            position="relative"
            bgGradient="linear(to-r, teal.500, teal.600)"
          />

          {/* Avatar with cleaner positioning */}
          <Avatar
            size="lg"
            name={mergedProfileData?.fullName}
            src={mergedProfileData?.avatar}
            position="absolute"
            top="10"
            left="0"
            right="0"
            mx="auto"
            border="3px solid white"
            bg="teal.500"
          >
            <AvatarBadge
              boxSize="1em"
              bg="green.500"
              border="2px solid white"
            />
          </Avatar>

          <ModalCloseButton
            color="white"
            top="3"
            right="3"
            _hover={{ bg: "blackAlpha.300" }}
          />

          {/* Profile header with name and badge */}
          <ModalHeader pt="10" pb="2" textAlign="center">
            <Text fontSize="xl" fontWeight="semibold">
              {mergedProfileData?.fullName || "Hospital Admin"}
            </Text>
            <Badge
              colorScheme="teal"
              px="2"
              py="0.5"
              borderRadius="full"
              fontSize="xs"
              mt="1"
            >
              {mergedProfileData?.role?.toUpperCase() || "ADMINISTRATOR"}
            </Badge>
          </ModalHeader>

          {/* Simplified content area */}
          <ModalBody py={4}>
            <Box
              bg="gray.50"
              borderRadius="md"
              p={4}
              borderLeft="3px solid"
              borderColor="teal.500"
            >
              <VStack spacing={3} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Hospital
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {mergedProfileData?.hospital?.name ||
                      "Central Medical Center"}
                  </Text>
                </HStack>

                <Divider borderColor="gray.200" />

                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Email
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {mergedProfileData?.email || "user@example.com"}
                  </Text>
                </HStack>

                <Divider borderColor="gray.200" />

                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Last Active
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {mergedProfileData?.lastLogin
                      ? new Date(mergedProfileData.lastLogin).toLocaleString()
                      : "Recently"}
                  </Text>
                </HStack>

                <Divider borderColor="gray.200" />

                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Account Created
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {mergedProfileData?.createdAt
                      ? new Date(
                          mergedProfileData.createdAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </ModalBody>

          <ModalFooter
            bg="gray.50"
            borderTop="1px"
            borderColor="gray.100"
            py={3}
          >
            <Button
              colorScheme="teal"
              size="sm"
              onClick={onClose}
              boxShadow="sm"
              fontWeight="medium"
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
