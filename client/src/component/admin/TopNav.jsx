import { ChevronDownIcon, SettingsIcon } from "@chakra-ui/icons";
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
import { notification } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById } from "../../features/user/userSlice";
import CustomLoader from "../common/CustomSpinner";

export const TopNav = () => {
  const dispatch = useDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());

  const id = useSelector((state) => state.auth.user?.data?._id);
  const profile = useSelector((state) => state.userSlice?.user);

  const currentAdmin = useMemo(() => ({ id, profile }), [id, profile]);

  // Update time every minute
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
      notification.error({
        title: "Failed to load profile",
        description: error.message || "Could not retrieve profile information",
        status: "error",
        duration: 3,
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
      px={6}
      py={3}
      borderBottom="1px"
      borderColor="gray.200"
      alignItems="center"
      justifyContent="space-between"
      boxShadow="sm"
      position="sticky"
      top="0"
      zIndex="sticky"
    >
      {/* Left side - Logo and title */}
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

      {/* Right side - Notifications, Help, Settings, Profile */}
      <Flex alignItems="center" gap={4}>
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
                    <Text fontWeight="medium" display={["none", null, "block"]}>
                      {currentAdmin.profile?.fullName?.split(" ")[0] || "Admin"}
                    </Text>
                    <ChevronDownIcon display={["none", null, "block"]} />
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
                {currentAdmin.profile?.fullName || "System Admin"}
              </Text>
              <Text fontSize="xs" color="gray.500" noOfLines={1} mt="-1">
                {currentAdmin.profile?.email || "admin@example.com"}
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
      </Flex>

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
              {currentAdmin.profile?.fullName || "System Admin"}
            </Text>
            <Badge
              colorScheme="teal"
              px="2"
              py="0.5"
              borderRadius="full"
              fontSize="xs"
              mt="1"
            >
              ADMINISTRATOR
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
                    Email
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {currentAdmin.profile?.email || "admin@example.com"}
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
                      : "January 1, 2023"}
                  </Text>
                </HStack>

                <Divider borderColor="gray.200" />

                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Role
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    System Administrator
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
