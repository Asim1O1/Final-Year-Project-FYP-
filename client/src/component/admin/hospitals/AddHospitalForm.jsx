import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Heading,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { notification } from "antd";
import { X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllHospitals,
  handleHospitalRegistration,
} from "../../../features/hospital/hospitalSlice";

import { SpinnerIcon } from "@chakra-ui/icons";
import PREDEFINED_SPECIALTIES from "@shared/Specialties";
const AddHospitalForm = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const { isLoading } = useSelector((state) => state?.hospitalSlice);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    contactNumber: "",
    email: "",
    hospitalImage: null,
    specialties: [],
  });

  const validateField = (fieldName, value) => {
    let error = "";

    switch (fieldName) {
      case "name":
        if (!value || value.trim() === "") {
          error = "Hospital name is required.";
        } else if (value.length < 3) {
          error = "Hospital name must be at least 3 characters.";
        } else if (value.length > 100) {
          error = "Hospital name must be less than 100 characters.";
        }
        break;

      case "location":
        if (!value || value.trim() === "") {
          error = "Hospital address is required.";
        } else if (value.length < 10) {
          error = "Address must be at least 10 characters.";
        } else if (value.length > 200) {
          error = "Address must be less than 200 characters.";
        }
        break;

      case "contactNumber":
        if (!value || value.trim() === "") {
          error = "Contact number is required.";
        } else if (!/^\d{10}$/.test(value)) {
          error = "Contact number must be a valid 10-digit number.";
        }
        break;

      case "email":
        if (!value || value.trim() === "") {
          error = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address.";
        } else if (value.length > 100) {
          error = "Email must be less than 100 characters.";
        }
        break;

      case "hospitalImage":
        if (!value) {
          error = "Hospital image is required.";
        } else if (value.size > 5 * 1024 * 1024) {
          // 5MB limit
          error = "Image size must be less than 5MB.";
        } else if (!["image/jpeg", "image/png"].includes(value.type)) {
          error = "Only JPG and PNG images are allowed.";
        }
        break;

      case "specialties":
        if (!value || value.length === 0) {
          error = "At least one specialty is required.";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [fieldName]: error }));
    return !error;
  };

  const handleBlur = (fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, formData[fieldName]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate the field if it's been touched
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        hospitalImage: file,
      }));

      // Validate the image if the field is touched
      if (touched.hospitalImage) {
        validateField("hospitalImage", file);
      }
    }
  };

  const handleSpecialtyChange = (e) => {
    const value = e.target.value;
    if (value && !formData.specialties.includes(value)) {
      const newSpecialties = [...formData.specialties, value];
      setFormData((prev) => ({
        ...prev,
        specialties: newSpecialties,
      }));

      // Validate specialties
      validateField("specialties", newSpecialties);
    }
  };

  const removeSpecialty = (indexToRemove) => {
    const newSpecialties = formData.specialties.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData((prev) => ({
      ...prev,
      specialties: newSpecialties,
    }));

    // Validate specialties
    if (touched.specialties) {
      validateField("specialties", newSpecialties);
    }
  };

  const handleValidation = () => {
    // Validate all fields
    const fieldsToValidate = [
      "name",
      "location",
      "contactNumber",
      "email",
      "hospitalImage",
      "specialties",
    ];

    let isValid = true;
    const newTouched = {};
    const newErrors = {};

    fieldsToValidate.forEach((field) => {
      newTouched[field] = true;
      const value = formData[field];
      const fieldValid = validateField(field, value);
      if (!fieldValid) {
        newErrors[field] = errors[field] || `${field} is invalid`;
        isValid = false;
      }
    });

    setTouched((prev) => ({ ...prev, ...newTouched }));
    setErrors((prev) => ({ ...prev, ...newErrors }));

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!handleValidation()) {
      // Show the first error in a notification
      const firstErrorKey = Object.keys(errors).find((key) => errors[key]);
      if (firstErrorKey) {
        notification.error({
          message: "Validation Error",
          description: errors[firstErrorKey],
          duration: 3,
        });
      }
      return;
    }

    try {
      const hospitalData = new FormData();

      // Add simple field values
      hospitalData.append("name", formData.name);
      hospitalData.append("location", formData.location);
      hospitalData.append("contactNumber", formData.contactNumber);
      hospitalData.append("email", formData.email);

      // Add file
      if (formData.hospitalImage) {
        hospitalData.append("hospitalImage", formData.hospitalImage);
      }

      // Add specialties as array
      formData.specialties.forEach((specialty, index) => {
        hospitalData.append(`specialties[${index}]`, specialty);
      });

      const result = await dispatch(handleHospitalRegistration(hospitalData));

      if (handleHospitalRegistration.fulfilled.match(result)) {
        notification.success({
          message: "Hospital Registration Successful",
          description:
            result?.payload?.message ||
            "Hospital has been registered successfully!",
          duration: 3,
        });

        // Reset form
        setFormData({
          name: "",
          location: "",
          contactNumber: "",
          email: "",
          hospitalImage: null,
          specialties: [],
        });
        setErrors({});
        setTouched({});

        // Refresh list with current page
        await dispatch(fetchAllHospitals({ page: 1, limit: 10 })).unwrap();

        onClose();
      } else if (handleHospitalRegistration.rejected.match(result)) {
        notification.error({
          message: "Hospital Registration Failed",
          description:
            result?.payload?.error || "Something went wrong. Please try again.",
          duration: 3,
        });
      }
    } catch (error) {
      console.error("Error during hospital registration:", error);
      notification.error({
        message: "Hospital Registration Failed",
        description:
          error.message || "Something went wrong. Please try again later.",
        duration: 3,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit}>
        <ModalHeader>Add New Hospital</ModalHeader>
        <ModalBody>
          <Tabs>
            <TabList>
              <Tab>Basic Info</Tab>
              <Tab>Specialties</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl
                    isRequired
                    isInvalid={touched.name && !!errors.name}
                  >
                    <FormLabel>Hospital Name</FormLabel>
                    <Input
                      placeholder="Enter hospital name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={() => handleBlur("name")}
                    />
                    {touched.name && errors.name && (
                      <FormErrorMessage>{errors.name}</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl
                    isRequired
                    isInvalid={touched.location && !!errors.location}
                  >
                    <FormLabel>Location</FormLabel>
                    <Input
                      placeholder="Enter location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      onBlur={() => handleBlur("location")}
                    />
                    {touched.location && errors.location && (
                      <FormErrorMessage>{errors.location}</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl
                    isRequired
                    isInvalid={touched.contactNumber && !!errors.contactNumber}
                  >
                    <FormLabel>Contact Number</FormLabel>
                    <Input
                      placeholder="Enter contact number"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      onBlur={() => handleBlur("contactNumber")}
                    />
                    {touched.contactNumber && errors.contactNumber && (
                      <FormErrorMessage>
                        {errors.contactNumber}
                      </FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl
                    isRequired
                    isInvalid={touched.email && !!errors.email}
                  >
                    <FormLabel>Email</FormLabel>
                    <Input
                      placeholder="Enter email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur("email")}
                    />
                    {touched.email && errors.email && (
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl
                    gridColumn="span 2"
                    isRequired
                    isInvalid={touched.hospitalImage && !!errors.hospitalImage}
                  >
                    <FormLabel>Hospital Image</FormLabel>
                    <Input
                      type="file"
                      name="hospitalImage"
                      accept="image/jpeg, image/png"
                      onChange={handleImageChange}
                      onBlur={() => handleBlur("hospitalImage")}
                    />
                    {touched.hospitalImage && errors.hospitalImage && (
                      <FormErrorMessage>
                        {errors.hospitalImage}
                      </FormErrorMessage>
                    )}
                    {formData.hospitalImage && (
                      <Text mt={1} fontSize="sm">
                        Selected: {formData.hospitalImage.name}
                      </Text>
                    )}
                  </FormControl>
                </Grid>
              </TabPanel>

              <TabPanel>
                <VStack align="stretch" spacing={4}>
                  <Box>
                    <Heading size="sm" mb={2}>
                      Specialties
                    </Heading>
                    <FormControl
                      isInvalid={touched.specialties && !!errors.specialties}
                    >
                      <FormLabel>Select Specialties</FormLabel>
                      <Select
                        placeholder="Select specialties"
                        name="specialty"
                        value=""
                        onChange={handleSpecialtyChange}
                        onBlur={() => handleBlur("specialties")}
                      >
                        {PREDEFINED_SPECIALTIES.map((specialty, index) => (
                          <option key={index} value={specialty}>
                            {specialty}
                          </option>
                        ))}
                      </Select>
                      {touched.specialties && errors.specialties && (
                        <FormErrorMessage>
                          {errors.specialties}
                        </FormErrorMessage>
                      )}
                    </FormControl>

                    {formData.specialties.length > 0 && (
                      <Box mt={4} p={4} borderWidth="1px" borderRadius="md">
                        <Heading size="sm" mb={2}>
                          Selected Specialties ({formData.specialties.length})
                        </Heading>
                        <VStack align="stretch" spacing={2}>
                          {formData.specialties.map((specialty, index) => (
                            <HStack
                              key={index}
                              justify="space-between"
                              p={2}
                              bg="gray.50"
                              borderRadius="md"
                            >
                              <Box>{specialty}</Box>
                              <IconButton
                                icon={<X />}
                                onClick={() => removeSpecialty(index)}
                                size="sm"
                                colorScheme="red"
                                aria-label={`Remove ${specialty}`}
                              />
                            </HStack>
                          ))}
                        </VStack>
                      </Box>
                    )}
                  </Box>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isLoading}
            loadingText="Saving..."
            spinner={<SpinnerIcon size="sm" />}
          >
            Save Hospital
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddHospitalForm;
