import React from 'react';
import {
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  VStack
} from '@chakra-ui/react';
import {
  SearchIcon,
  BellIcon,
  ChevronDownIcon,
  SettingsIcon,
  QuestionIcon
} from '@chakra-ui/icons';

export const HospitalTopNav = () => {
  const notifications = [
    {
      id: 1,
      title: 'New Appointment Request',
      message: 'Dr. Wilson has a new appointment request',
      time: '5 min ago',
      isUnread: true
    },
    {
      id: 2,
      title: 'Test Results Ready',
      message: 'Lab results for patient #12345 are ready',
      time: '1 hour ago',
      isUnread: true
    },
    {
      id: 3,
      title: 'System Update',
      message: 'New features have been added to the platform',
      time: '2 hours ago',
      isUnread: false
    }
  ];

  const hospitalInfo = {
    name: 'Central Medical Center',
    adminName: 'James Wilson',
    role: 'Hospital Administrator',
    avatar: '/hospital-logo.png'
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
    >
      {/* Left Section - Search */}
      <InputGroup maxW="400px">
        <Input 
          placeholder="Search patients, doctors, appointments..." 
          bg="gray.50"
        />
        <InputRightElement>
          <SearchIcon color="gray.500" />
        </InputRightElement>
      </InputGroup>

      {/* Right Section - Actions and Profile */}
      <HStack spacing={4}>
        {/* Help Button */}
        <IconButton
          icon={<QuestionIcon />}
          variant="ghost"
          aria-label="Help"
          rounded="full"
        />

        {/* Notifications */}
        <Popover placement="bottom-end">
          <PopoverTrigger>
            <Box position="relative">
              <IconButton
                icon={<BellIcon />}
                variant="ghost"
                aria-label="Notifications"
                rounded="full"
              />
              <Badge 
                position="absolute"
                top="-1"
                right="-1"
                colorScheme="red"
                rounded="full"
                size="sm"
              >
                2
              </Badge>
            </Box>
          </PopoverTrigger>
          <PopoverContent width="400px">
            <PopoverHeader fontWeight="bold">
              Notifications
            </PopoverHeader>
            <PopoverBody p={0}>
              <VStack align="stretch" spacing={0}>
                {notifications.map((notification) => (
                  <Box 
                    key={notification.id}
                    p={4}
                    bg={notification.isUnread ? "blue.50" : "white"}
                    _hover={{ bg: "gray.50" }}
                    cursor="pointer"
                  >
                    <Text fontWeight="medium">{notification.title}</Text>
                    <Text fontSize="sm" color="gray.600" mt={1}>
                      {notification.message}
                    </Text>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      {notification.time}
                    </Text>
                  </Box>
                ))}
                <Divider />
                <Button variant="ghost" size="sm" width="full">
                  View All Notifications
                </Button>
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Popover>

        {/* Settings */}
        <IconButton
          icon={<SettingsIcon />}
          variant="ghost"
          aria-label="Settings"
          rounded="full"
        />

        {/* Profile Menu */}
        <Menu>
          <MenuButton>
            <HStack spacing={3}>
              <Avatar 
                size="sm" 
                name={hospitalInfo.name}
                src={hospitalInfo.avatar}
              />
              <Box display={{ base: 'none', md: 'block' }} textAlign="left">
                <Text fontWeight="medium" fontSize="sm">
                  {hospitalInfo.name}
                </Text>
                <Text fontSize="xs" color="gray.600">
                  {hospitalInfo.role}
                </Text>
              </Box>
              <ChevronDownIcon />
            </HStack>
          </MenuButton>
          <MenuList>
            <MenuItem>Hospital Profile</MenuItem>
            <MenuItem>Account Settings</MenuItem>
            <MenuItem>Billing & Subscription</MenuItem>
            <Divider />
            <MenuItem color="red.500">Sign Out</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
};