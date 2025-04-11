import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  Icon,
  Text,
  useColorModeValue,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Card,
  CardHeader,
  CardBody,
  Badge,
 
  Image,
  HStack,
  VStack,
} from "@chakra-ui/react";
import React, { useState,useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  BriefcaseMedical,
  DollarSign,
  Building2,
} from "lucide-react";
import { DeleteIcon, EditIcon, TimeIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import UpdateDoctorForm from "./UpdateDoctor";
import Pagination from "../../../utils/Pagination";
import {
  fetchAllDoctors,
  handleDoctorDeletion,
} from "../../../features/doctor/doctorSlice";
import { notification } from "antd";
import CustomLoader from "../../common/CustomSpinner";

const DoctorList = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(1);
 const currentUser = useSelector((state) => state?.auth?.user?.data);
 const hospitalId = currentUser?.hospital;
  const dispatch = useDispatch();
  const { doctors, isLoading, totalPages } = useSelector(
    (state) => state.doctorSlice
  );
  const cancelRef = React.useRef();

  const bgHover = useColorModeValue("blue.50", "blue.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.800", "white");

  // Fetch doctors when the component mounts or when currentPage/filters change
  useEffect(() => {
    if (hospitalId) {
      dispatch(fetchAllDoctors({ 
        page: currentPage, 
        limit: 10,
        hospital: hospitalId
      }));
    }
  }, [dispatch, currentPage, hospitalId]);

  const handleEditClick = (doctor) => {
    setSelectedDoctor(doctor);
    onOpen();
  };

  const handleCloseModal = () => {
    setSelectedDoctor(null);
    onClose();
  };

  const handleDeleteClick = (doctor) => {
    setSelectedDoctor(doctor);
    onDeleteOpen();
  };
  const handleDeleteConfirm = async () => {
    if (selectedDoctor) {
      try {
        await dispatch(handleDoctorDeletion(selectedDoctor._id)).unwrap();
        notification.success({
          message: "Doctor Deleted",
          description: "The doctor has been successfully deleted.",
        }); 
        setSelectedDoctor(null);
        onDeleteClose();
        dispatch(fetchAllDoctors({ page: currentPage, limit: 10, hospital: hospitalId }));
      } catch (error) {
        notification.error({
          message: "Failed to delete doctor",
          description:
            error?.message || "Something went wrong. Please try again.",
        });
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const InfoItem = ({ icon, text, ...rest }) => (
    <Flex align="center" gap={2} {...rest}>
      <Icon as={icon} color={textColor} boxSize={4} />
      <Text color={textColor} fontSize="sm" noOfLines={1}>
        {text}
      </Text>
    </Flex>
  );

  return (
    <Card shadow="sm" variant="outline">
      <CardHeader borderBottomWidth="1px" borderColor={borderColor}>
        <Flex align="center" gap={2}>
          <Icon as={BriefcaseMedical} color="blue.500" boxSize={6} />
          <Heading size="md">Available Doctors</Heading>
        </Flex>
      </CardHeader>

      <CardBody p={4}>
        {isLoading ? (
          <Flex justify="center" py={8}>
            <CustomLoader size="xl" color="blue.500" />
          </Flex>
        ) : (
          <Flex direction="column" gap={4}>
            {doctors?.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Text color={textColor}>No doctors found</Text>
              </Box>
            ) : (
              doctors?.doctors?.map((doctor) => (
                <Box
                  key={doctor._id}
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
                  <Flex direction={{ base: "column", md: "row" }} gap={4}>
                    <Box flex="1">
                      <Flex align="center" gap={4} mb={4}>
                        <Box
                          w="12"
                          h="12"
                          borderRadius="full"
                          bg="blue.100"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {/* Profile Image */}
                          <Image
                            src={doctor.doctorProfileImage}
                            alt={doctor.fullName}
                            borderRadius="full"
                            boxSize="48px"
                            objectFit="cover"
                          />
                        </Box>
                        <Box>
                          <Heading size="sm" color={headingColor} mb={1}>
                            {doctor.fullName}
                          </Heading>
                          <Badge colorScheme="blue" variant="subtle">
                            {doctor.specialization}
                          </Badge>
                        </Box>
                      </Flex>

                      <Grid
                        templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }}
                        gap={3}
                        mb={3}
                      >
                        <InfoItem icon={Mail} text={doctor.email} />
                        <InfoItem icon={Phone} text={doctor.phone} />
                        <InfoItem icon={MapPin} text={doctor.address} />
                        <InfoItem
                          icon={Building2}
                          text={doctor?.hospital?.name}
                        />
                        <InfoItem
                          icon={BriefcaseMedical}
                          text={doctor.specialization}
                        />
                        <InfoItem icon={User} text={doctor.gender} />
                        <InfoItem
                          icon={TimeIcon}
                          text={`${doctor.yearsOfExperience} years`}
                        />
                        <InfoItem
                          icon={DollarSign}
                          text={`$${doctor.consultationFee}`}
                        />
                      </Grid>

                      {/* Qualifications */}
                      <VStack align="start" mt={4} spacing={2}>
                        {Array.isArray(doctor.qualifications) &&
                        doctor.qualifications.length > 0 ? (
                          doctor.qualifications.map((qualification) => (
                            <HStack
                              key={qualification._id}
                              bg="gray.100"
                              px={3}
                              py={1}
                              borderRadius="md"
                            >
                              <Text>
                                {qualification.degree} -{" "}
                                {qualification.university} (
                                {qualification.graduationYear})
                              </Text>
                            </HStack>
                          ))
                        ) : (
                          <Text>No qualifications available.</Text>
                        )}
                      </VStack>

                      <Divider my={3} />
                    </Box>

                    <Flex
                      direction={{ base: "row", md: "column" }}
                      gap={2}
                      minW={{ base: "full", md: "120px" }}
                      justify={{ base: "stretch", md: "flex-start" }}
                    >
                      <UpdateDoctorForm
                        isOpen={isOpen}
                        onClose={handleCloseModal}
                        doctorData={selectedDoctor}
                      />

                      <Button
                        leftIcon={<EditIcon />}
                        colorScheme="blue"
                        variant="outline"
                        onClick={() => handleEditClick(doctor)}
                        size="sm"
                        w="full"
                      >
                        Edit
                      </Button>

                      <Button
                        leftIcon={<DeleteIcon />}
                        colorScheme="red"
                        variant="outline"
                        onClick={() => handleDeleteClick(doctor)}
                        size="sm"
                        w="full"
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
              Delete Doctor
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this doctor? This action cannot be
              undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => handleDeleteConfirm(selectedDoctor)}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Card>
  );
};

export default DoctorList;
