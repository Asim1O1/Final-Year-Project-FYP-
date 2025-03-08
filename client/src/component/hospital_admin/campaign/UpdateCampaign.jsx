import React, { useState, useEffect } from "react";
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
  FormErrorMessage,
  Stack,
  useToast,
  Textarea,
} from "@chakra-ui/react";
import { Input, DatePicker, Select } from "antd";
import dayjs from "dayjs";

const UpdateCampaignForm = ({ isOpen, onClose, campaignData, hospitals }) => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    hospital: "",
  });
  const [errors, setErrors] = useState({});

  // Update form data when campaign data changes
  useEffect(() => {
    if (campaignData) {
      setFormData({
        title: campaignData.title || "",
        description: campaignData.description || "",
        date: campaignData.date || "",
        location: campaignData.location || "",
        hospital: campaignData.hospital || "",
      });
    }
  }, [campaignData]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Handle date change
  const handleDateChange = (date, dateString) => {
    setFormData({
      ...formData,
      date: dateString,
    });

    // Clear error for this field
    if (errors.date) {
      setErrors({
        ...errors,
        date: "",
      });
    }
  };

  // Handle hospital selection
  const handleHospitalChange = (value) => {
    setFormData({
      ...formData,
      hospital: value,
    });

    // Clear error for this field
    if (errors.hospital) {
      setErrors({
        ...errors,
        hospital: "",
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    if (!formData.hospital) {
      newErrors.hospital = "Hospital is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically send the data to your API
      // For now, we'll just simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Campaign updated",
        description: "The campaign has been updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating the campaign. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Campaign</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl isInvalid={errors.title}>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                placeholder="Enter campaign title"
                value={formData.title}
                onChange={handleInputChange}
              />
              <FormErrorMessage>{errors.title}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.description}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                placeholder="Enter campaign description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
              <FormErrorMessage>{errors.description}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.date}>
              <FormLabel>Date</FormLabel>
              <DatePicker
                placeholder="Select date"
                value={formData.date ? dayjs(formData.date) : null}
                onChange={handleDateChange}
                style={{ width: "100%" }}
              />
              <FormErrorMessage>{errors.date}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.location}>
              <FormLabel>Location</FormLabel>
              <Input
                name="location"
                placeholder="Enter campaign location"
                value={formData.location}
                onChange={handleInputChange}
              />
              <FormErrorMessage>{errors.location}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.hospital}>
              <FormLabel>Hospital</FormLabel>
              <Select
                placeholder="Select hospital"
                style={{ width: "100%" }}
                options={hospitals}
                value={formData.hospital || undefined}
                onChange={handleHospitalChange}
              />
              <FormErrorMessage>{errors.hospital}</FormErrorMessage>
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            isLoading={isSubmitting}
            onClick={handleSubmit}
          >
            Update Campaign
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateCampaignForm;