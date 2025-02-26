import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Flex,
  Text,
  SimpleGrid,
  Stack,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  VStack,
  HStack,
  IconButton,
  Image,
  Select,
  useToast,
  Icon,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";

import { handleDoctorRegistration } from "../../../features/doctor/doctorSlice";
import {
  Award,
  AwardIcon,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  GraduationCap,
  ImageIcon,
  Mail,
  MapPin,
  User,
  X,
} from "lucide-react";
import { PhoneIcon } from "@chakra-ui/icons";
import { notification, Upload } from "antd";

import { fetchAllHospitals } from "../../../features/hospital/hospitalSlice";
import Pagination from "../../../utils/Pagination";
import InputForm from "../../auth/InputForm";
import PasswordToggle from "../../auth/PasswordToggle";

const AddDoctorForm = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [activeTab, setActiveTab] = React.useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [qualificationForm, setQualificationForm] = useState({
    degree: "",
    university: "",
    graduationYear: "",
  });

  const initialFormData = {
    fullName: "",
    phone: "",
    specialization: "",
    qualifications: {},
    hospital: "",
    email: "",
    gender: "",
    yearsOfExperience: "",
    consultationFee: "",
    address: "",
    doctorProfileImage: null,
    certificationImage: [],
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleQualificationChange = (e) => {
    const { name, value } = e.target;
    setQualificationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddQualification = () => {
    if (
      qualificationForm.degree &&
      qualificationForm.university &&
      qualificationForm.graduationYear
    ) {
      // Generate a unique key for the new qualification
      const qualificationKey = `qual_${Date.now()}`;

      setFormData((prev) => ({
        ...prev,
        qualifications: {
          ...prev.qualifications, // Keep existing qualifications
          [qualificationKey]: {
            // Add new qualification with a unique key
            degree: qualificationForm.degree,
            university: qualificationForm.university,
            graduationYear: qualificationForm.graduationYear,
          },
        },
      }));

      // Clear form fields
      setQualificationForm({
        degree: "",
        university: "",
        graduationYear: "",
      });
    } else {
      toast({
        title: "Error",
        description: "Please fill all qualification fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const removeQualification = (key) => {
    setFormData((prev) => {
      const updatedQualifications = { ...prev.qualifications };
      delete updatedQualifications[key]; // Remove the qualification with the specified key
      return {
        ...prev,
        qualifications: updatedQualifications,
      };
    });
  };
  const totalPages = useSelector(
    (state) => state?.hospitalSlice?.data?.pagination?.totalPages
  );

  const hospitals = useSelector(
    (state) => state?.hospitalSlice?.hospitals?.hospitals
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllHospitals({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, doctorProfileImage: file }));
    }
  };

  const handleCertificationUpload = (e) => {
    const files = e.target.files;
    if (files) {
      const certificationImage = Array.from(files).map((file) => ({
        documentName: file.name,
        fileType: file.type,
        file,
      }));
      setFormData((prev) => ({
        ...prev,
        certificationImage: [...prev.certificationImage, ...certificationImage],
      }));
    }
  };

  const removeCertification = (index) => {
    setFormData((prev) => ({
      ...prev,
      certificationImage: prev.certificationImage.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] === undefined || formData[key] === null) {
          return;
        }

        if (key === "qualifications") {
          // Convert object of qualifications into an array
          const qualificationsArray = Object.values(formData.qualifications);
          qualificationsArray.forEach((qual, index) => {
            formDataToSend.append(
              `qualifications[${index}][degree]`,
              qual.degree
            );
            formDataToSend.append(
              `qualifications[${index}][university]`,
              qual.university
            );
            formDataToSend.append(
              `qualifications[${index}][graduationYear]`,
              qual.graduationYear
            );
          });
        } else if (
          key === "doctorProfileImage" &&
          formData[key] instanceof File
        ) {
          formDataToSend.append("doctorProfileImage", formData[key]);
        } else if (key === "certificationImage") {
          formData.certificationImage.forEach((cert, index) => {
            if (cert.file instanceof File) {
              formDataToSend.append("certificationImage", cert.file);
            }
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Log the FormData to verify its contents
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      // Send the FormData to the backend
      const response = await dispatch(
        handleDoctorRegistration(formDataToSend)
      ).unwrap();

      console.log("The response is", response);

      notification.success({
        title: "Success",
        description: response.message,
        status: "success",
        duration: 3,
        isClosable: true,
      });
      setFormData(initialFormData);
      onClose();
    } catch (error) {
      console.log("The error is", error);
      notification.error({
        message: error.message || "Failed to register doctor",
        description: error?.error,
        duration: 3,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <Box
          position="fixed"
          top="0"
          right="0"
          bottom="0"
          left="0"
          zIndex="9999"
          bg="rgba(0, 0, 0, 0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Box>
      )}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="4xl"
        motionPreset="slideInBottom"
      >
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
        <ModalContent bg="white" borderRadius="xl" shadow="xl">
          <ModalHeader borderBottom="1px" borderColor="gray.200" py={4} px={6}>
            <Flex align="center" gap={3}>
              <Box bg="blue.500" p={2} borderRadius="lg" color="white">
                <User size={20} />
              </Box>
              <Text fontSize="lg" fontWeight="semibold">
                Add New Doctor
              </Text>
            </Flex>
          </ModalHeader>

          <form onSubmit={handleSubmit}>
            <ModalBody py={6} px={6}>
              <Tabs
                isFitted
                variant="enclosed"
                onChange={(index) => setActiveTab(index)}
              >
                <TabList mb="1em">
                  <Tab>Basic Information</Tab>
                  <Tab>Professional Details</Tab>
                  <Tab>Qualifications</Tab>
                  <Tab>Documents</Tab>
                </TabList>

                <TabPanels>
                  {/* Basic Information Tab */}
                  <TabPanel>
                    <Stack spacing={5}>
                      <SimpleGrid columns={2} spacing={6}>
                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="medium">
                            Full Name
                          </FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <Icon as={User} size={18} />
                            </InputLeftElement>
                            <Input
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleChange}
                              placeholder="John Doe"
                              bg="gray.50"
                              pl="40px"
                            />
                          </InputGroup>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="medium">
                            Email Address
                          </FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <Icon as={Mail} size={18} />
                            </InputLeftElement>
                            <Input
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="johndoe@example.com"
                              bg="gray.50"
                              pl="40px"
                            />
                          </InputGroup>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="medium">
                            Phone Number
                          </FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <Icon as={PhoneIcon} size={18} />
                            </InputLeftElement>
                            <Input
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="+1234567890"
                              bg="gray.50"
                              pl="40px"
                            />
                          </InputGroup>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="medium">
                            Gender
                          </FormLabel>
                          <Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            placeholder="Select Gender"
                            bg="gray.50"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </Select>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="medium">
                            Address
                          </FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <Icon as={MapPin} size={18} />
                            </InputLeftElement>
                            <Input
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              placeholder="123 Main St, City, Country"
                              bg="gray.50"
                              pl="40px"
                            />
                          </InputGroup>
                        </FormControl>

                        <InputForm
                          label="Password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          isRequired
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          rightElement={
                            <PasswordToggle
                              showPassword={showPassword}
                              togglePasswordVisibility={() =>
                                setShowPassword(!showPassword)
                              }
                            />
                          }
                        />
                      </SimpleGrid>
                    </Stack>
                  </TabPanel>

                  {/* Professional Details Tab */}
                  <TabPanel>
                    <Stack spacing={5}>
                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="medium">
                          Specialization
                        </FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <Icon as={AwardIcon} size={18} />
                          </InputLeftElement>
                          <Input
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            placeholder="Cardiology"
                            bg="gray.50"
                            pl="40px"
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="medium">
                          Years of Experience
                        </FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <Icon as={Award} size={18} />
                          </InputLeftElement>
                          <Input
                            name="yearsOfExperience"
                            value={formData.yearsOfExperience}
                            onChange={handleChange}
                            placeholder="10"
                            bg="gray.50"
                            pl="40px"
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="medium">
                          Consultation Fee
                        </FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <Icon as={DollarSign} size={18} />
                          </InputLeftElement>
                          <Input
                            name="consultationFee"
                            value={formData.consultationFee}
                            onChange={handleChange}
                            placeholder="100"
                            bg="gray.50"
                            pl="40px"
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="medium">
                          Hospital
                        </FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <Icon as={Building2} size={18} />
                          </InputLeftElement>
                          <Select
                            name="hospital"
                            value={formData.hospital}
                            onChange={handleChange}
                            pl="40px"
                          >
                            <option value="">Select Hospital</option>
                            {hospitals?.map((hospital) => (
                              <option key={hospital._id} value={hospital._id}>
                                {hospital.name}
                              </option>
                            ))}
                          </Select>
                        </InputGroup>
                      </FormControl>
                    </Stack>
                  </TabPanel>

                  {/* Qualifications Tab */}
                  <TabPanel>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium">
                        Add Qualification
                      </FormLabel>
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <GraduationCap size={18} />
                          </InputLeftElement>
                          <Input
                            name="degree"
                            placeholder="Enter degree"
                            value={qualificationForm.degree}
                            onChange={handleQualificationChange}
                            bg="gray.50"
                            pl="40px"
                          />
                        </InputGroup>

                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <Building2 size={18} />
                          </InputLeftElement>
                          <Input
                            name="university"
                            placeholder="Enter university name"
                            value={qualificationForm.university}
                            onChange={handleQualificationChange}
                            bg="gray.50"
                            pl="40px"
                          />
                        </InputGroup>

                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <Calendar size={18} />
                          </InputLeftElement>
                          <Input
                            name="graduationYear"
                            type="number"
                            placeholder="Enter graduation year"
                            value={qualificationForm.graduationYear}
                            onChange={handleQualificationChange}
                            bg="gray.50"
                            pl="40px"
                          />
                        </InputGroup>
                      </SimpleGrid>

                      <Button
                        mt={4}
                        onClick={handleAddQualification}
                        colorScheme="blue"
                      >
                        Add Qualification
                      </Button>

                      <VStack align="start" mt={4} spacing={2}>
                        {Object.entries(formData.qualifications).map(
                          ([key, qualification]) => (
                            <HStack
                              key={key}
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
                              <IconButton
                                icon={<X size={14} />}
                                size="xs"
                                onClick={() => removeQualification(key)}
                              />
                            </HStack>
                          )
                        )}
                      </VStack>
                    </FormControl>
                  </TabPanel>

                  {/* Documents Tab */}
                  <TabPanel>
                    <Stack spacing={6}>
                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="medium">
                          Profile Image
                        </FormLabel>
                        <VStack spacing={4} align="center">
                          {formData.doctorProfileImage && (
                            <Image
                              src={URL.createObjectURL(
                                formData.doctorProfileImage
                              )}
                              alt="Profile Preview"
                              boxSize="150px"
                              objectFit="cover"
                              borderRadius="full"
                            />
                          )}
                          <Button
                            leftIcon={<Icon as={ImageIcon} />}
                            onClick={() =>
                              document
                                .getElementById("doctorProfileImage")
                                .click()
                            }
                          >
                            {formData.doctorProfileImage
                              ? "Change Image"
                              : "Upload Image"}
                          </Button>
                          <Input
                            id="doctorProfileImage"
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                            display="none"
                          />
                        </VStack>
                      </FormControl>

                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="medium">
                          Certifications
                        </FormLabel>
                        <VStack spacing={4} align="stretch">
                          <Button
                            leftIcon={<Icon as={Upload} />}
                            onClick={() =>
                              document
                                .getElementById("certificationImage")
                                .click()
                            }
                          >
                            Upload Certifications
                          </Button>
                          <Input
                            id="certificationImage"
                            type="file"
                            accept=".pdf,image/*"
                            multiple
                            onChange={handleCertificationUpload}
                            display="none"
                          />

                          {formData.certificationImage.map((cert, index) => (
                            <HStack
                              key={index}
                              p={2}
                              bg="gray.50"
                              borderRadius="md"
                            >
                              <Icon
                                as={
                                  cert.fileType === "pdf" ? FileText : ImageIcon
                                }
                              />
                              <Text flex="1" isTruncated>
                                {cert.documentName}
                              </Text>
                              <IconButton
                                icon={<Icon as={X} />}
                                size="sm"
                                variant="ghost"
                                onClick={() => removeCertification(index)}
                              />
                            </HStack>
                          ))}
                        </VStack>
                      </FormControl>
                    </Stack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>

            <ModalFooter borderTop="1px" borderColor="gray.200" py={4} px={6}>
              <Button variant="ghost" mr={3} onClick={onClose} size="md">
                Cancel
              </Button>
              <Button
                type="submit"
                colorScheme="blue"
                size="md"
                isLoading={isLoading}
                loadingText="Creating..."
              >
                Create Doctor
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddDoctorForm;
