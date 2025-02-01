import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Grid,
  Box,
  Spinner,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Text,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { handleHospitalUpdate } from "../../../features/hospital/hospitalSlice";
import { Edit, Plus } from "lucide-react";

import { MedicalTestsEditor, SpecialtiesEditor } from "./MedicalTestEeditor";
import { fetchAllHospitals } from "../../../features/hospital/hospitalSlice";
import { notification } from "antd";

const UpdateHospitalForm = ({ isOpen, onClose, hospital }) => {
  console.log("The hospital data received from the hospital list", hospital);
  const dispatch = useDispatch();

  const { isLoading, hospitals } = useSelector((state) => state.hospitalSlice);
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    contactNumber: "",
    email: "",

    hospitalImage: "",
    hospitalImageFile: null,
    specialties: [],
    medicalTests: [],
    campaigns: "",
  });

  useEffect(() => {
    if (hospital && hospitals) {
      setFormData({
        name: hospital.name || "",
        location: hospital.location || "",
        contactNumber: hospital.contactNumber || "",
        email: hospital.email || "",

        hospitalImage: hospital.hospitalImage || "",
        specialties: Array.isArray(hospital.specialties)
          ? hospital.specialties
          : [],
        medicalTests: Array.isArray(hospital.medicalTests)
          ? hospital.medicalTests
          : [],
        campaigns: hospital.campaigns || "",
      });
    }
  }, [hospital, hospitals]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        hospitalImageFile: file,
        hospitalImagePreview: previewUrl, 
      }));
    }
  };

  const handleValidation = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Hospital name is required.";
    if (!formData.location.trim()) errors.location = "Location is required.";
    if (
      !formData.contactNumber.trim() ||
      !/^\d{10}$/.test(formData.contactNumber)
    ) {
      errors.contactNumber = "Enter a valid 10-digit contact number.";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Enter a valid email address.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = handleValidation();
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((message) =>
        notification({
          title: "Validation Error",
          description: message,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      );
      return;
    }

    // Create FormData object
    const formDataToSend = new FormData();

    // Append regular fields
    formDataToSend.append("name", formData.name);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("contactNumber", formData.contactNumber);
    formDataToSend.append("email", formData.email);

    formData.campaigns.forEach((campaign) => {
      formDataToSend.append("campaigns[]", campaign);
    });

    // Append specialties as individual fields
    formData.specialties.forEach((specialty) => {
      formDataToSend.append("specialties[]", specialty); 
    });

    // Append medicalTests as an array of objects (do not stringify)
    formData.medicalTests.forEach((test, index) => {
      
      formDataToSend.append(`medicalTests[${index}][name]`, test.name); 
      formDataToSend.append(`medicalTests[${index}][price]`, test.price);
    });
    // Append image file or existing URL
    if (formData.hospitalImageFile) {
      formDataToSend.append("hospitalImage", formData.hospitalImageFile);
    } else if (formData.hospitalImage) {
      formDataToSend.append("hospitalImage", formData.hospitalImage);
    }

    try {
      console.log("REACHED INSIDE THE TRY CATCH OF THE HOSPITAL FORM");
      console.log("hospitalData is", hospital._id);
      const result = await dispatch(
        handleHospitalUpdate({
          hospitalId: hospital._id,
          hospitalData: formDataToSend,
        })
      ).unwrap();
      console.log("The result received is ", result);
      if (result.isSuccess) {
        console.log("Reached the fulfilled status in update hospital data");
        // Clear form fields
        setFormData({
          name: "",
          location: "",
          contactNumber: "",
          email: "",
          hospitalImage: "",
          specialties: [],
          medicalTests: [],
          campaigns: "",
        });
        await dispatch(fetchAllHospitals({ page: currentPage, limit: 10 })).unwrap();
        notification.success({
          message: "Update Successful",
          description:
            result?.message || "Hospital details updated successfully!",
          duration: 3,
        });
        onClose();
      } else {
        console.log(
          "Reached the else that is rejetced in the handle hospiyal update "
        );
        console.log("The error is", result.error);
        notification.error({
          message: "Update Failed",
          description:
            result.error?.message || "Something went wrong. Please try again.",
          duration: 3,
        });
      }
    } catch (error) {
      console.log("The error is", error);
      notification.error({
        message: "Update Failed",
        description:
          error?.error?.message || "Something went wrong. Please try again.",
        duration: 3,
      });
    }
  };

  return (
    <>
      {isLoading && (
        <Box
          position="fixed"
          inset="0"
          bg="blackAlpha.500"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="overlay"
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

      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader className="border-b">
              Update Hospital Details
            </ModalHeader>
            <ModalBody className="p-6">
              <Tabs>
                <TabList className="mb-4">
                  <Tab>Basic Info</Tab>
                  <Tab>Specialties & Tests</Tab>
                  <Tab>Campaigns</Tab>
                </TabList>

                <TabPanels>
                  {/* Basic Info Tab */}
                  <TabPanel>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                      <FormControl isRequired>
                        <FormLabel>Hospital Name</FormLabel>
                        <Input
                          placeholder="Enter hospital name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="hover:border-blue-500 focus:border-blue-500"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Location</FormLabel>
                        <Input
                          placeholder="Enter location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="hover:border-blue-500 focus:border-blue-500"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Contact Number</FormLabel>
                        <Input
                          placeholder="Enter contact number"
                          name="contactNumber"
                          value={formData.contactNumber}
                          onChange={handleChange}
                          className="hover:border-blue-500 focus:border-blue-500"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input
                          placeholder="Enter email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="hover:border-blue-500 focus:border-blue-500"
                        />
                      </FormControl>

                      <FormControl gridColumn="span 2">
                        <FormLabel>Hospital Image</FormLabel>
                        <Box className="relative group">
                          <Box className="relative w-full h-48 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                            {formData.hospitalImagePreview ||
                            formData.hospitalImage ? (
                              <>
                                <img
                                  src={
                                    formData.hospitalImagePreview ||
                                    formData.hospitalImage
                                  }
                                  alt="Current Hospital"
                                  className="w-full h-full object-cover"
                                />
                                <Box className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200">
                                  <Box className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <label
                                      htmlFor="hospitalImage"
                                      className="cursor-pointer p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                      <Edit className="w-5 h-5 text-gray-700" />
                                    </label>
                                  </Box>
                                </Box>
                              </>
                            ) : (
                              <Box className="absolute inset-0 flex flex-col items-center justify-center">
                                <Box className="p-3 bg-gray-100 rounded-full">
                                  <Edit className="w-5 h-5 text-gray-400" />
                                </Box>
                                <Box className="mt-2 text-sm text-gray-500">
                                  Click to upload image
                                </Box>
                              </Box>
                            )}
                            <Input
                              id="hospitalImage"
                              type="file"
                              name="hospitalImage"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </Box>
                        </Box>
                      </FormControl>
                    </Grid>
                  </TabPanel>

                  {/* Specialties & Tests Tab */}
                  <TabPanel>
                    <Box mb={6}>
                      <Text fontSize="lg" fontWeight="medium" mb={4}>
                        Specialties
                      </Text>
                      <SpecialtiesEditor
                        items={formData.specialties}
                        setFormData={setFormData}
                      />
                    </Box>

                    <Box>
                      <Text fontSize="lg" fontWeight="medium" mb={4}>
                        Medical Tests
                      </Text>
                      <MedicalTestsEditor
                        items={formData.medicalTests}
                        setFormData={setFormData}
                      />
                    </Box>
                  </TabPanel>

                  {/* Campaigns Tab */}
                  <TabPanel>
                    <FormControl>
                      <FormLabel>Campaigns</FormLabel>
                      <Textarea
                        placeholder="Enter campaigns details"
                        name="campaigns"
                        value={formData.campaigns}
                        onChange={handleChange}
                        rows={6}
                        className="hover:border-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>

            <ModalFooter className="border-t">
              <Button
                onClick={onClose}
                variant="outline"
                className="mr-3 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isLoading}
                className="hover:bg-blue-600"
              >
                Update
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateHospitalForm;
