import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Grid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  IconButton,
  Select,
} from "@chakra-ui/react";
import { X } from "lucide-react";
import { notification } from "antd";
import { handleHospitalRegistration } from "../../../features/hospital/hospitalSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllHospitals } from "../../../features/hospital/hospitalSlice";

import PREDEFINED_SPECIALTIES from "../../../../../constants/Specialties";
import { SpinnerIcon } from "@chakra-ui/icons";
const AddHospitalForm = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  const { isLoading } = useSelector((state) => state?.hospitalSlice);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    contactNumber: "",
    email: "",
    hospitalImage: "",
    specialties: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageChange = (e, setFormData) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        hospitalImage: file,
      }));
    }
  };

  const predefinedSpecialties = PREDEFINED_SPECIALTIES;
  const handleValidation = () => {
    const errors = {};

    // Validate Hospital Name
    if (!formData.name || formData.name.trim() === "") {
      errors.name = "Hospital name is required.";
    } else if (formData.name.length < 3) {
      errors.name = "Hospital name must be at least 3 characters.";
    }

    // Validate Address
    if (!formData.location || formData.location.trim() === "") {
      errors.location = "Hospital address is required.";
    }

    // Validate Contact Number
    if (!formData.contactNumber || formData.contactNumber.trim() === "") {
      errors.contactNumber = "Contact number is required.";
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      errors.contactNumber = "Contact number must be a valid 10-digit number.";
    }

    // Validate Email (if applicable)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    // Validate Hospital Image
    if (!formData.hospitalImage) {
      errors.hospitalImage = "Hospital image is required.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const errors = handleValidation();
      if (Object.keys(errors).length > 0) {
        Object.values(errors).forEach((message) => {
          notification.error({
            message: "Validation Error",
            description: message,
            duration: 3,
          });
        });
        return;
      }

      const hospitalData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === "object") {
              Object.entries(item).forEach(([subKey, subValue]) => {
                hospitalData.append(`${key}[${index}][${subKey}]`, subValue);
              });
            } else {
              hospitalData.append(`${key}[${index}]`, item);
            }
          });
        } else {
          hospitalData.append(key, value);
        }
      });

      console.log("The hospital data is", hospitalData);

      const result = await dispatch(handleHospitalRegistration(hospitalData));
      console.log("The resultt while adding hospital i is", result);

      if (handleHospitalRegistration.fulfilled.match(result)) {
        notification.success({
          message: "Hospital Registration Successful",
          description:
            result?.payload?.message ||
            "Hospital has been registered successfully!",
          duration: 3,
        });
        setFormData({
          name: "",
          location: "",
          contactNumber: "",
          email: "",
          hospitalImage: "",
          specialties: [],
        });

        await dispatch(
          fetchAllHospitals({ page: currentPage, limit: 10 })
        ).unwrap();
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
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
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
                    <FormControl isRequired>
                      <FormLabel>Hospital Name</FormLabel>
                      <Input
                        placeholder="Enter hospital name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Location</FormLabel>
                      <Input
                        placeholder="Enter location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Contact Number</FormLabel>
                      <Input
                        placeholder="Enter contact number"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input
                        placeholder="Enter email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormControl gridColumn="span 2">
                      <FormLabel>Hospital Image</FormLabel>
                      <Input
                        type="file"
                        name="hospitalImage"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, setFormData)}
                      />
                    </FormControl>
                  </Grid>
                </TabPanel>

                <TabPanel>
                  <VStack align="stretch" spacing={4}>
                    <Box>
                      <Heading size="sm" mb={2}>
                        Specialties
                      </Heading>
                      <FormControl isRequired>
                        <FormLabel>Select Specialties</FormLabel>
                        <Select
                          placeholder="Select specialties"
                          onChange={(e) => {
                            const newSpecialties = [
                              ...formData.specialties,
                              e.target.value,
                            ];
                            setFormData({
                              ...formData,
                              specialties: newSpecialties,
                            });
                          }}
                        >
                          {predefinedSpecialties.map((specialty, index) => (
                            <option key={index} value={specialty}>
                              {specialty}
                            </option>
                          ))}
                        </Select>
                      </FormControl>

                      {formData.specialties.length > 0 && (
                        <Box mt={2}>
                          <Heading size="sm" mb={2}>
                            Selected Specialties
                          </Heading>
                          <VStack spacing={2}>
                            {formData.specialties.map((specialty, index) => (
                              <HStack key={index} mb={2}>
                                <Box>{specialty}</Box>
                                <IconButton
                                  icon={<X />}
                                  onClick={() => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      specialties: prev.specialties.filter(
                                        (_, idx) => idx !== index
                                      ),
                                    }));
                                  }}
                                  size="sm"
                                  colorScheme="red"
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
    </>
  );
};

export default AddHospitalForm;
