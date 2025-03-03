// pages/Confirmation.js
import React from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Flex, 
  Text, 
  Button, 
  Divider,
  SimpleGrid,
  Stack,
  Avatar,
  Icon,
  HStack,
  VStack,
  RadioGroup,
  Radio,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Circle
} from '@chakra-ui/react';
import { ChevronRightIcon, CheckIcon, DownloadIcon, CalendarIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { FaCreditCard, FaPaypal, FaApplePay, FaCalendarPlus, FaShareAlt, FaFileAlt, FaIdCard, FaFileDownload, FaInfoCircle } from 'react-icons/fa';
import MainLayout from '../../layouts/MainLayout';


const ConfirmationPage = () => {
  return (
    <>
       <Container maxW="container.md" py={8}>
        <Heading size="md" color="blue.500" mb={6}>Appointment Confirmed</Heading>
        
        <Breadcrumb separator={<ChevronRightIcon color="gray.500" />} mb={8}>
          <BreadcrumbItem>
            <BreadcrumbLink>Select Doctor</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>Choose Time</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>New Info</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Confirmation</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <Box textAlign="center" mb={8}>
          <Circle size="60px" bg="green.100" color="green.500" mx="auto" mb={3}>
            <CheckIcon boxSize={6} />
          </Circle>
          <Heading size="md" color="green.500" mb={2}>Appointment Confirmed!</Heading>
          <Text color="gray.600">Your appointment has been successfully scheduled</Text>
        </Box>
        
        <Box borderWidth="1px" borderRadius="lg" p={6} mb={8}>
          <Flex direction={{ base: 'column', md: 'row' }} mb={6}>
            <Avatar src="/doctor-placeholder-3.jpg" size="lg" mr={4} mb={{ base: 4, md: 0 }} />
            <Box flex="1">
              <Text fontWeight="bold" color="gray.700">Dr. Sarah Wilson</Text>
              <Text fontSize="sm" color="gray.600" mb={2}>Cardiologist | Memorial Hospital</Text>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
                <Flex align="center">
                  <Icon as={CalendarIcon} color="gray.500" mr={2} />
                  <Box>
                    <Text fontSize="xs" color="gray.500">Date & Time</Text>
                    <Text fontSize="sm">March 15, 2025 | 10:00 AM</Text>
                  </Box>
                </Flex>
                
                <Flex align="center">
                  <Icon as={FaInfoCircle} color="gray.500" mr={2} />
                  <Box>
                    <Text fontSize="xs" color="gray.500">Consultation Mode</Text>
                    <Text fontSize="sm">Video Consultation</Text>
                  </Box>
                </Flex>
              </SimpleGrid>
            </Box>
          </Flex>
          
          <Divider my={6} />
          
          <Box mb={6}>
            <Text fontWeight="medium" mb={3}>Fee Breakdown</Text>
            <Flex justify="space-between" mb={2}>
              <Text fontSize="sm" color="gray.600">Consultation Fee</Text>
              <Text fontSize="sm">$150.00</Text>
            </Flex>
            <Flex justify="space-between" mb={2}>
              <Text fontSize="sm" color="gray.600">Platform Fee</Text>
              <Text fontSize="sm">$10.00</Text>
            </Flex>
            <Divider my={3} />
            <Flex justify="space-between" fontWeight="bold">
              <Text>Total Amount</Text>
              <Text>$160.00</Text>
            </Flex>
          </Box>
          
          <Divider my={6} />
          
          <Box mb={6}>
            <Text fontWeight="medium" mb={4}>Payment Method</Text>
            <RadioGroup defaultValue="credit-card">
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <Radio value="credit-card" colorScheme="blue" isChecked>
                  <Flex align="center">
                    <Icon as={FaCreditCard} mr={2} />
                    <Text>Credit Card</Text>
                  </Flex>
                </Radio>
                <Radio value="paypal" colorScheme="blue">
                  <Flex align="center">
                    <Icon as={FaPaypal} mr={2} />
                    <Text>PayPal</Text>
                  </Flex>
                </Radio>
                <Radio value="apple-pay" colorScheme="blue">
                  <Flex align="center">
                    <Icon as={FaApplePay} mr={2} />
                    <Text>Apple Pay</Text>
                  </Flex>
                </Radio>
              </SimpleGrid>
            </RadioGroup>
          </Box>
          
          <Divider my={6} />
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Box borderWidth="1px" borderRadius="md" p={4}>
              <Flex direction="column" align="center">
                <Icon as={FaFileAlt} color="blue.500" boxSize={6} mb={3} />
                <Text fontWeight="medium" mb={2}>Preparation</Text>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Fast for 6 hours
                  Bring medical records
                  Wear comfortable clothes
                </Text>
              </Flex>
            </Box>
            
            <Box borderWidth="1px" borderRadius="md" p={4}>
              <Flex direction="column" align="center">
                <Icon as={FaIdCard} color="blue.500" boxSize={6} mb={3} />
                <Text fontWeight="medium" mb={2}>Required Documents</Text>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Photo ID
                  Insurance Card
                  Previous Reports
                </Text>
              </Flex>
            </Box>
            
            <Box borderWidth="1px" borderRadius="md" p={4}>
              <Flex direction="column" align="center">
                <Icon as={FaInfoCircle} color="blue.500" boxSize={6} mb={3} />
                <Text fontWeight="medium" mb={2}>Cancellation Policy</Text>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Free cancellation up to 24 hours before appointment
                </Text>
              </Flex>
            </Box>
          </SimpleGrid>
        </Box>
        
        <HStack spacing={4} justify="center">
          <Button leftIcon={<FaFileDownload />} colorScheme="blue">
            Download Appointment Info
          </Button>
          <Button leftIcon={<FaCalendarPlus />} variant="outline">
            Add to Calendar
          </Button>
          <Button leftIcon={<FaShareAlt />} variant="outline">
            Share Details
          </Button>
        </HStack>
      </Container></>

  );
};

export default ConfirmationPage;