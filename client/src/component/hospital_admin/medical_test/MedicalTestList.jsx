import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Grid,
  Heading,
  Icon,
  Image,
 
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomLoader from "../../common/CustomSpinner";
import {
  deleteMedicalTest,
  fetchAllMedicalTests,
} from "../../../features/medical_test/medicalTestSlice";
import { notification } from "antd";
import {
  Activity,
  Badge,
  Building,
  Clock,
  DollarSign,
  FileText,
  MapPin,
} from "lucide-react";
import { DeleteIcon, EditIcon, PhoneIcon } from "@chakra-ui/icons";
import Pagination from "../../../utils/Pagination";
import UpdateMedicalTestForm from "./UpdateMedicalTest";

const MedicalTestList = () => {
  const [selectedTest, setSelectedTest] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const { medicalTests, isLoading, totalPages } = useSelector(
    (state) => state?.medicalTestSlice
  );
  const cancelRef = React.useRef();

  const bgHover = useColorModeValue("blue.50", "blue.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.800", "white");

  // Fetch medical tests when the component mounts or when currentPage/filters change
  useEffect(() => {
    dispatch(fetchAllMedicalTests({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const handleEditClick = (test) => {
    setSelectedTest(test);
    onOpen();
  };

  const handleCloseModal = () => {
    setSelectedTest(null);
    onClose();
  };

  const handleDeleteClick = (test) => {
    setSelectedTest(test);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (selectedTest) {
      try {
      const result =   await dispatch(deleteMedicalTest(selectedTest._id)).unwrap();
      console.log("The result is", result)
        notification.success({
          message: "Medical Test Deleted",
          description: "The medical test has been successfully deleted.",
        });
        setSelectedTest(null);
        onDeleteClose();
        dispatch(fetchAllMedicalTests({ page: currentPage, limit: 10 }));
      } catch (error) {
        console.log("The error is", error)
        notification.error({
          message: "Failed to delete medical test",
          description:
            error?.message || "Something went wrong. Please try again.",
        });
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const InfoItem = ({ icon, text, label, iconColor }) => (
    <Flex align="center" gap={3}>
      <Box 
        p={2} 
        bg="white" 
        borderRadius="md" 
        boxShadow="sm"
      >
        <Icon as={icon} color={iconColor || "gray.500"} boxSize={5} />
      </Box>
      <Box>
        <Text fontSize="xs" color="gray.500" mb="1px">
          {label}
        </Text>
        <Text fontSize="sm" fontWeight="medium" color={textColor}>
          {text}
        </Text>
      </Box>
    </Flex>
  );
  return (
    <Card shadow="sm" variant="outline">
      <CardHeader borderBottomWidth="1px" borderColor={borderColor}>
        <Flex align="center" gap={2}>
          <Icon as={Activity} color="blue.500" boxSize={6} />
          <Heading size="md">Available Medical Tests</Heading>
        </Flex>
      </CardHeader>

      <CardBody p={4}>
        {isLoading ? (
          <Flex justify="center" py={8}>
            <CustomLoader size="xl" color="blue.500" />
          </Flex>
        ) : (
          <Flex direction="column" gap={4}>
            {medicalTests?.data?.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Text color={textColor}>No medical tests found</Text>
              </Box>
            ) : (
              medicalTests?.data?.map((test) => (
                <Box
                  key={test._id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  borderColor={borderColor}
                  transition="all 0.2s"
                  _hover={{
                    bg: bgHover,
                    borderColor: "blue.200",
                    shadow: "md",
                  }}
                >
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    gap={6}
                    p={5}
                    bg="white"
                    borderRadius="lg"
                    boxShadow="md"
                    _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
                    transition="all 0.3s ease"
                    border="1px solid"
                    borderColor="gray.100"
                  >
                    <Box flex="1">
                      <Flex align="center" gap={4} mb={5}>
                        <Box
                          w="14"
                          h="14"
                          borderRadius="full"
                          bg="green.50"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          boxShadow="sm"
                        >
                          <Icon as={FileText} color="green.500" boxSize={6} />
                        </Box>
                        <Box>
                          <Heading
                            size="md"
                            color={headingColor}
                            mb={1}
                            fontWeight="semibold"
                          >
                            {test.testName}
                          </Heading>
                          
                        </Box>
                        <Box ml="auto">
                          <Image
                            src={test.testImage}
                            alt={test.testName}
                            borderRadius="md"
                            boxSize="60px"
                            objectFit="cover"
                            boxShadow="sm"
                            border="2px solid"
                            borderColor="gray.100"
                          />
                        </Box>
                      </Flex>

                      <Grid
                        templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }}
                        gap={4}
                        mb={5}
                        p={4}
                        bg="gray.50"
                        borderRadius="md"
                      >
                        <InfoItem
                          icon={Building}
                          text={test.hospital?.name}
                          label="Hospital"
                          iconColor="blue.500"
                        />
                        <InfoItem
                          icon={DollarSign}
                          text={`$${test.testPrice}`}
                          label="Price"
                          iconColor="green.500"
                        />
                        <InfoItem
                          icon={MapPin}
                          text={test.hospital.location}
                          label="Location"
                          iconColor="red.500"
                        />
                        <InfoItem
                          icon={PhoneIcon}
                          text={test.hospital.contactNumber}
                          label="Contact"
                          iconColor="purple.500"
                        />
                      </Grid>

                      <Box
                        mt={4}
                        p={4}
                        bg="blue.50"
                        borderRadius="md"
                        borderLeft="4px solid"
                        borderColor="blue.200"
                      >
                        <Text fontSize="sm" color={textColor} lineHeight="1.6">
                          <Text as="span" fontWeight="bold" color="blue.700">
                            Description:{" "}
                          </Text>
                          {test.testDescription}
                        </Text>
                      </Box>

                      <Divider my={4} borderColor="gray.200" />
                    </Box>

                    <Flex
                      direction={{ base: "row", md: "column" }}
                      gap={3}
                      minW={{ base: "full", md: "140px" }}
                      justify={{ base: "space-between", md: "flex-start" }}
                      align={{ base: "center", md: "stretch" }}
                    >
                      <UpdateMedicalTestForm
                        isOpen={isOpen}
                        onClose={handleCloseModal}
                        testData={selectedTest}
                      />

                      <Button
                        leftIcon={<EditIcon />}
                        colorScheme="blue"
                        variant="solid"
                        onClick={() => handleEditClick(test)}
                        size="md"
                        w="full"
                        boxShadow="sm"
                        _hover={{ boxShadow: "md" }}
                      >
                        Edit
                      </Button>

                      <Button
                        leftIcon={<DeleteIcon />}
                        colorScheme="red"
                        variant="outline"
                        onClick={() => handleDeleteClick(test)}
                        size="md"
                        w="full"
                        boxShadow="sm"
                        _hover={{ bg: "red.50", boxShadow: "md" }}
                      >
                        Delete
                      </Button>
                    </Flex>
                  </Flex>
                </Box>
              ))
            )}
          </Flex>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages || 1}
          onPageChange={handlePageChange}
        />
      </CardBody>

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Medical Test
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this medical test? This action
              cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Card>
  );
};

export default MedicalTestList;
