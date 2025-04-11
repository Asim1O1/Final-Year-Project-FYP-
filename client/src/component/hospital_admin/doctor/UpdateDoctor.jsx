import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
  Textarea,
  Box,
  Flex,
  FormErrorMessage,
  Divider,
  IconButton,
  Image,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAllDoctors,
  handleDoctorUpdate,
} from "../../../features/doctor/doctorSlice";
import PREDEFINED_SPECIALTIES from "../../../../../constants/Specialties";

import { notification } from "antd";

const UpdateDoctorForm = ({ isOpen, onClose, doctorData }) => {
  const dispatch = useDispatch();

  const fileInputRef = useRef(null);
  const profileFileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    specialization: "",
    consultationFee: 0,
    yearsOfExperience: 0,
    hospital: "",
    password: "",
    qualifications: [],
    certificationImage: null,
    doctorProfileImage: null,
    certificationImageUrl: "",
    doctorProfileImageUrl: "",
  });

  const [tabIndex, setTabIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [certificationPreview, setCertificationPreview] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const currentUser = useSelector((state) => state?.auth?.user?.data);
  const hospitalId = currentUser?.hospital;

  useEffect(() => {
    if (isOpen) {
      dispatch(
        fetchAllDoctors({
          page: currentPage,
          limit: 10,
          hospital: hospitalId,
        })
      );
    }
  }, [isOpen, dispatch, currentPage, hospitalId]);
  const predefinedSpecialties = PREDEFINED_SPECIALTIES;

  // Populate form when doctorData changes
  useEffect(() => {
    if (doctorData) {
      setFormData({
        fullName: doctorData.fullName || "",
        email: doctorData.email || "",
        phone: doctorData.phone || "",
        address: doctorData.address || "",
        gender: doctorData.gender || "",
        specialization: doctorData.specialization || "",
        consultationFee: doctorData.consultationFee || 0,
        yearsOfExperience: doctorData.yearsOfExperience || 0,
        hospital: doctorData.hospital || "",
        password: "", // Don't populate password for security
        qualifications: doctorData.qualifications || [],
        certificationImage: null,
        doctorProfileImage: null,
        certificationImageUrl: doctorData.certificationImage || "",
        doctorProfileImageUrl: doctorData.doctorProfileImage || "",
      });

      setCertificationPreview(doctorData.certificationImage || "");
      setProfileImagePreview(doctorData.doctorProfileImage || "");

      // Reset to first tab when opening modal
      setTabIndex(0);
    }
  }, [doctorData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName) newErrors.fullName = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.specialization)
      newErrors.specialization = "Specialization is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      if (fileType === "certification") {
        setFormData((prev) => ({ ...prev, certificationImage: file }));
        setCertificationPreview(URL.createObjectURL(file));
      } else if (fileType === "profile") {
        setFormData((prev) => ({ ...prev, doctorProfileImage: file }));
        setProfileImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleAddQualification = () => {
    setFormData((prev) => ({
      ...prev,
      qualifications: [
        ...prev.qualifications,
        { degree: "", university: "", graduationYear: "" },
      ],
    }));
  };

  const handleRemoveQualification = (index) => {
    const updatedQualifications = [...formData.qualifications];
    updatedQualifications.splice(index, 1);
    setFormData((prev) => ({ ...prev, qualifications: updatedQualifications }));
  };
  const handleQualificationChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: prev.qualifications.map((qualification, i) =>
        i === index ? { ...qualification, [field]: value } : qualification
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setTabIndex(0);
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file uploads
      const form = new FormData();

      // Add text fields
      Object.keys(formData).forEach((key) => {
        if (
          key !== "certificationImage" &&
          key !== "doctorProfileImage" &&
          key !== "qualifications" &&
          key !== "certificationImageUrl" &&
          key !== "doctorProfileImageUrl" &&
          formData[key] !== ""
        ) {
          form.append(key, formData[key]);
        }
      });

      // Add qualifications as JSON
      form.append("qualifications", JSON.stringify(formData.qualifications));

      // Add existing image URLs if no new images
      if (formData.certificationImageUrl && !formData.certificationImage) {
        form.append("certificationImageUrl", formData.certificationImageUrl);
      }

      if (formData.doctorProfileImageUrl && !formData.doctorProfileImage) {
        form.append("doctorProfileImageUrl", formData.doctorProfileImageUrl);
      }

      // Add files if selected
      if (formData.certificationImage) {
        form.append("certificationImage", formData.certificationImage);
      }

      if (formData.doctorProfileImage) {
        form.append("doctorProfileImage", formData.doctorProfileImage);
      }

      // Send update request
      const response = await dispatch(
        handleDoctorUpdate({
          doctorId: doctorData._id,
          doctorData: form,
        })
      ).unwrap();
      console.log("The response hile updting docgtor is", response);

      if (response.isSuccess) {
        notification.success({
          message: "Doctor Updated",
          description:
            response?.message ||
            "Doctor information has been updated successfully.",
          duration: 2.5,
        });

        // Refresh doctor list
        dispatch(
          fetchAllDoctors({
            page: currentPage,
            limit: 10,
            hospital: hospitalId,
          })
        );
        onClose();
      } else {
        notification.error({
          message: "Update Failed",
          description: response.message || "Failed to update doctor.",
          duration: 2.5,
        });
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
      notification.error({
        message: "Error",
        description:
          error.message || "An error occurred while updating the doctor.",
        duration: 2.5,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabsChange = (index) => {
    setTabIndex(index);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(5px)" />
      <ModalContent boxShadow="2xl" borderRadius="lg">
        <ModalHeader bg="blue.50" borderTopRadius="lg" py={4}>
          <Flex alignItems="center">
            <Box fontWeight="bold">Edit Doctor: {doctorData?.fullName}</Box>
            <Badge
              colorScheme="blue"
              ml={2}
              px={2}
              py={1}
              borderRadius="md"
              fontSize="sm"
            >
              {doctorData?.specialization}
            </Badge>
          </Flex>
        </ModalHeader>
        <ModalCloseButton className="hover:bg-gray-100 transition-colors" />
        <ModalBody p={6}>
          <Tabs
            isFitted
            variant="enclosed"
            colorScheme="blue"
            index={tabIndex}
            onChange={handleTabsChange}
            className="shadow-sm"
          >
            <TabList mb={4} className="rounded-t-md border border-gray-200">
              <Tab
                className="font-medium transition-colors hover:bg-blue-50"
                _selected={{ bg: "blue.50", borderColor: "blue.500" }}
              >
                Personal Info
              </Tab>
              <Tab
                className="font-medium transition-colors hover:bg-blue-50"
                _selected={{ bg: "blue.50", borderColor: "blue.500" }}
              >
                Professional
              </Tab>
              <Tab
                className="font-medium transition-colors hover:bg-blue-50"
                _selected={{ bg: "blue.50", borderColor: "blue.500" }}
              >
                Qualifications
              </Tab>
              <Tab
                className="font-medium transition-colors hover:bg-blue-50"
                _selected={{ bg: "blue.50", borderColor: "blue.500" }}
              >
                Images
              </Tab>
            </TabList>

            <TabPanels className="border border-gray-200 rounded-b-md bg-white shadow-sm">
              {/* Tab 1: Personal Information */}
              <TabPanel>
                <VStack spacing={5} align="stretch">
                  <FormControl isInvalid={errors.fullName}>
                    <FormLabel fontWeight="medium">Full Name</FormLabel>
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      className="hover:border-blue-300 focus:border-blue-500"
                      borderRadius="md"
                      bg="gray.50"
                      _focus={{ bg: "white" }}
                    />
                    {errors.fullName && (
                      <FormErrorMessage className="text-red-500">
                        {errors.fullName}
                      </FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl isInvalid={errors.phone}>
                    <FormLabel fontWeight="medium">Phone</FormLabel>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      className="hover:border-blue-300 focus:border-blue-500"
                      borderRadius="md"
                      bg="gray.50"
                      _focus={{ bg: "white" }}
                    />
                    {errors.phone && (
                      <FormErrorMessage className="text-red-500">
                        {errors.phone}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl>
                    <FormLabel fontWeight="medium">Address</FormLabel>
                    <Textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Address"
                      rows={3}
                      className="hover:border-blue-300 focus:border-blue-500"
                      borderRadius="md"
                      bg="gray.50"
                      _focus={{ bg: "white" }}
                      resize="vertical"
                    />
                  </FormControl>
                </VStack>
              </TabPanel>

              {/* Tab 2: Professional Information */}
              <TabPanel>
                <VStack spacing={5} align="stretch">
                  <FormControl isInvalid={errors.specialization}>
                    <FormLabel fontWeight="medium">Specialization</FormLabel>
                    <Select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      placeholder="Select a specialization"
                      bg="gray.50"
                      pl="40px"
                    >
                      {predefinedSpecialties.map((specialty, index) => (
                        <option key={index} value={specialty}>
                          {specialty}
                        </option>
                      ))}
                    </Select>
                    {errors.specialization && (
                      <FormErrorMessage className="text-red-500">
                        {errors.specialization}
                      </FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight="medium">Consultation Fee</FormLabel>
                    <NumberInput
                      min={0}
                      value={formData.consultationFee}
                      onChange={(value) =>
                        handleNumberInputChange("consultationFee", value)
                      }
                      className="hover:border-blue-300 focus:border-blue-500"
                      borderRadius="md"
                    >
                      <NumberInputField bg="gray.50" _focus={{ bg: "white" }} />
                      <NumberInputStepper>
                        <NumberIncrementStepper className="hover:bg-blue-50" />
                        <NumberDecrementStepper className="hover:bg-blue-50" />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight="medium">
                      Years of Experience
                    </FormLabel>
                    <NumberInput
                      min={0}
                      value={formData.yearsOfExperience}
                      onChange={(value) =>
                        handleNumberInputChange("yearsOfExperience", value)
                      }
                      className="hover:border-blue-300 focus:border-blue-500"
                      borderRadius="md"
                    >
                      <NumberInputField bg="gray.50" _focus={{ bg: "white" }} />
                      <NumberInputStepper>
                        <NumberIncrementStepper className="hover:bg-blue-50" />
                        <NumberDecrementStepper className="hover:bg-blue-50" />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </VStack>
              </TabPanel>

              {/* Tab 3: Qualifications */}
              <TabPanel>
                <Flex justify="space-between" align="center" mb={4}>
                  <FormLabel m={0} fontWeight="medium">
                    Doctor Qualifications
                  </FormLabel>
                  <Button
                    leftIcon={<AddIcon />}
                    colorScheme="blue"
                    size="sm"
                    onClick={handleAddQualification}
                    className="hover:shadow-md transition-shadow"
                    borderRadius="md"
                  >
                    Add Qualification
                  </Button>
                </Flex>

                <VStack spacing={5} align="stretch">
                  {formData.qualifications.length === 0 ? (
                    <Box
                      p={5}
                      borderWidth="1px"
                      borderRadius="md"
                      textAlign="center"
                      bg="gray.50"
                      className="border-dashed"
                    >
                      <Box color="gray.500">No qualifications added yet</Box>
                    </Box>
                  ) : (
                    formData.qualifications.map((qual, index) => (
                      <Box
                        key={index}
                        p={5}
                        borderWidth="1px"
                        borderRadius="md"
                        position="relative"
                        bg="gray.50"
                        className="transition-all hover:shadow-md hover:border-blue-200"
                      >
                        <IconButton
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          size="sm"
                          position="absolute"
                          top={2}
                          right={2}
                          onClick={() => handleRemoveQualification(index)}
                          aria-label="Remove qualification"
                          className="opacity-70 hover:opacity-100"
                          borderRadius="md"
                        />

                        <VStack spacing={4} pt={5}>
                          <FormControl>
                            <FormLabel fontWeight="medium">Degree</FormLabel>
                            <Input
                              value={qual.degree}
                              onChange={(e) =>
                                handleQualificationChange(
                                  index,
                                  "degree",
                                  e.target.value
                                )
                              }
                              placeholder="Degree"
                              className="hover:border-blue-300 focus:border-blue-500"
                              bg="white"
                              borderRadius="md"
                            />
                          </FormControl>

                          <FormControl>
                            <FormLabel fontWeight="medium">
                              University
                            </FormLabel>
                            <Input
                              value={qual.university}
                              onChange={(e) =>
                                handleQualificationChange(
                                  index,
                                  "university",
                                  e.target.value
                                )
                              }
                              placeholder="University"
                              className="hover:border-blue-300 focus:border-blue-500"
                              bg="white"
                              borderRadius="md"
                            />
                          </FormControl>

                          <FormControl>
                            <FormLabel fontWeight="medium">
                              Graduation Year
                            </FormLabel>
                            <Input
                              value={qual.graduationYear}
                              onChange={(e) =>
                                handleQualificationChange(
                                  index,
                                  "graduationYear",
                                  e.target.value
                                )
                              }
                              placeholder="Graduation Year"
                              className="hover:border-blue-300 focus:border-blue-500"
                              bg="white"
                              borderRadius="md"
                            />
                          </FormControl>
                        </VStack>
                      </Box>
                    ))
                  )}
                </VStack>
              </TabPanel>

              {/* Tab 4: Images */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <FormControl>
                    <FormLabel fontWeight="medium">Profile Image</FormLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "profile")}
                      ref={profileFileInputRef}
                      display="none"
                    />

                    <Flex
                      direction="column"
                      align="center"
                      p={6}
                      borderWidth="1px"
                      borderRadius="md"
                      borderStyle="dashed"
                      className="hover:border-blue-300 transition-colors"
                      bg="gray.50"
                    >
                      {profileImagePreview ? (
                        <Box mb={4} className="shadow-md rounded-full">
                          <Image
                            src={profileImagePreview}
                            alt="Profile preview"
                            boxSize="150px"
                            objectFit="cover"
                            borderRadius="full"
                            bg="white"
                            className="transition-transform hover:scale-105"
                          />
                        </Box>
                      ) : (
                        <Box
                          mb={4}
                          borderRadius="full"
                          bg="white"
                          w="150px"
                          h="150px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          className="border border-gray-200 shadow-inner"
                        >
                          <Box as="span" fontSize="6xl" color="gray.400">
                            ?
                          </Box>
                        </Box>
                      )}

                      <Button
                        onClick={() => profileFileInputRef.current.click()}
                        colorScheme="blue"
                        size="sm"
                        className="hover:shadow-md transition-all"
                        borderRadius="md"
                      >
                        {profileImagePreview ? "Change Image" : "Upload Image"}
                      </Button>
                    </Flex>
                  </FormControl>

                  <Divider />

                  <FormControl>
                    <FormLabel fontWeight="medium">
                      Certification Image
                    </FormLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "certification")}
                      ref={fileInputRef}
                      display="none"
                    />

                    <Flex
                      direction="column"
                      align="center"
                      p={6}
                      borderWidth="1px"
                      borderRadius="md"
                      borderStyle="dashed"
                      className="hover:border-blue-300 transition-colors"
                      bg="gray.50"
                    >
                      {certificationPreview ? (
                        <Box mb={4} w="full" maxW="300px" className="shadow-md">
                          <Image
                            src={certificationPreview}
                            alt="Certification preview"
                            w="full"
                            objectFit="contain"
                            borderRadius="md"
                            bg="white"
                            className="transition-transform hover:scale-105"
                          />
                        </Box>
                      ) : (
                        <Box
                          mb={4}
                          w="full"
                          maxW="300px"
                          h="150px"
                          bg="white"
                          borderRadius="md"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          className="border border-gray-200 shadow-inner"
                        >
                          <Box as="span" fontSize="lg" color="gray.400">
                            No certificate uploaded
                          </Box>
                        </Box>
                      )}

                      <Button
                        onClick={() => fileInputRef.current.click()}
                        colorScheme="blue"
                        size="sm"
                        className="hover:shadow-md transition-all"
                        borderRadius="md"
                      >
                        {certificationPreview
                          ? "Change Certificate"
                          : "Upload Certificate"}
                      </Button>
                    </Flex>
                  </FormControl>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter bg="gray.50" borderBottomRadius="lg" py={4}>
          <Button
            variant="outline"
            mr={3}
            onClick={onClose}
            className="hover:bg-gray-100 transition-colors"
            borderRadius="md"
          >
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            className="hover:shadow-md transition-all"
            borderRadius="md"
            fontWeight="semibold"
          >
            Update Doctor
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateDoctorForm;
