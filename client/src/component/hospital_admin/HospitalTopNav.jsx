import React, { useEffect, useState } from "react";
import {
  Flex,
  HStack,
  Avatar,
  Text,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  Divider,
  Button,
  VStack,
  ModalFooter,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  AvatarBadge,
  ModalOverlay,
  ModalContent,
  Modal,
  MenuDivider,
  Icon,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ChevronDownIcon, LockIcon, SettingsIcon } from "@chakra-ui/icons";
import CustomLoader from "../common/CustomSpinner";
import { useDispatch, useSelector } from "react-redux";

import { fetchUserById } from "../../features/user/userSlice";
import { LogOutIcon } from "lucide-react";

export const HospitalTopNav = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Get current admin info from Redux store with proper structure
  const currentAdmin = useSelector((state) => ({
    id: state?.auth?.user?.data?._id,
    profile: state?.auth?.user?.data,
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleProfileClick = async () => {
    if (!currentAdmin.id) return;

    try {
      setIsLoadingProfile(true);
      await dispatch(fetchUserById(currentAdmin.id)).unwrap();
      onOpen();
    } catch (error) {
      toast({
        title: "Failed to load profile",
        description: error.message || "Could not retrieve profile information",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoadingProfile(false);
    }
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
                      name={currentAdmin.profile?.fullName}
                      src={currentAdmin.profile?.avatar}
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
                        {currentAdmin.profile?.fullName || "User"}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {currentAdmin.profile?.role || "Administrator"}
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
                name={currentAdmin.profile?.fullName}
                src={currentAdmin.profile?.avatar}
                bg="teal.500"
              />
              <Text fontWeight="medium" noOfLines={1}>
                {currentAdmin.profile?.fullName || "User"}
              </Text>
              <Text fontSize="xs" color="gray.500" noOfLines={1} mt="-1">
                {currentAdmin.profile?.email || "user@example.com"}
              </Text>
            </VStack>
            <MenuDivider />
            <MenuItem
              icon={<Icon as={SettingsIcon} />}
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
            name={currentAdmin.profile?.fullName}
            src={currentAdmin.profile?.avatar}
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
              {currentAdmin.profile?.fullName || "User"}
            </Text>
            <Badge
              colorScheme="teal"
              px="2"
              py="0.5"
              borderRadius="full"
              fontSize="xs"
              mt="1"
            >
              {currentAdmin.profile?.role?.toUpperCase() || "ADMINISTRATOR"}
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
              {/* Simplified profile info with cleaner spacing */}
              <VStack spacing={3} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Hospital
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {currentAdmin.profile?.hospital || "Central Medical Center"}
                  </Text>
                </HStack>

                <Divider borderColor="gray.200" />

                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Email
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {currentAdmin.profile?.email || "user@example.com"}
                  </Text>
                </HStack>

                <Divider borderColor="gray.200" />

                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Last Active
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {currentAdmin.profile?.lastLogin
                      ? new Date(
                          currentAdmin.profile.lastLogin
                        ).toLocaleString()
                      : "Recently"}
                  </Text>
                </HStack>

                <Divider borderColor="gray.200" />

                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Account Created
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {currentAdmin.profile?.createdAt
                      ? new Date(
                          currentAdmin.profile.createdAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </Text>
                </HStack>

                <Divider borderColor="gray.200" />

                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Role
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {currentAdmin.profile?.role || "Administrator"}
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </ModalBody>

          {/* Minimalistic footer */}
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
