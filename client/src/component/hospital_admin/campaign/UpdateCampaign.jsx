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
import { Input, DatePicker, Select, notification } from "antd";
import dayjs from "dayjs";
import { handleCampaignUpdate } from "../../../features/campaign/campaignSlice";

import { fetchAllCampaigns } from "../../../features/campaign/campaignSlice";
import { useDispatch, useSelector } from "react-redux";

const UpdateCampaignForm = ({ isOpen, onClose, campaignData, hospitals }) => {
  console.log("UpdateCampaignForm campaignData", campaignData);

  const dispatch = useDispatch();
  console.log("UpdateCampaignForm hospitals", hospitals);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const currentUser = useSelector((state) => state?.auth?.user?.data);
  const hospitalId = currentUser?.hospital;
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
    console.log(
      "[UpdateCampaignForm] useEffect - campaignData changed:",
      campaignData
    );

    if (campaignData) {
      console.log("[UpdateCampaignForm] Setting form data from campaignData");

      let hospitalValue = "";
      if (campaignData.hospital) {
        if (
          typeof campaignData.hospital === "object" &&
          campaignData.hospital._id
        ) {
          hospitalValue = campaignData.hospital._id;
          console.log(
            "[UpdateCampaignForm] Hospital is object, using _id:",
            hospitalValue
          );
        } else if (typeof campaignData.hospital === "string") {
          hospitalValue = campaignData.hospital;
          console.log(
            "[UpdateCampaignForm] Hospital is string, using value:",
            hospitalValue
          );
        }
      }

      setFormData({
        title: campaignData.title || "",
        description: campaignData.description || "",
        date: campaignData.date || "",
        location: campaignData.location || "",
        hospital: hospitalValue,
      });

      console.log("[UpdateCampaignForm] Form data set to:", {
        title: campaignData.title || "",
        description: campaignData.description || "",
        date: campaignData.date || "",
        location: campaignData.location || "",
        hospital: hospitalValue,
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

    if (errors.date) {
      setErrors({
        ...errors,
        date: "",
      });
    }
  };

  // Handle hospital select change
  const handleHospitalChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      hospital: value,
    });

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
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.hospital) newErrors.hospital = "Hospital is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await dispatch(
        handleCampaignUpdate({
          campaignId: campaignData?._id,
          updatedData: formData,
        })
      ).unwrap();
      console.log("the result while updating campaign is", result);
      dispatch(
        fetchAllCampaigns({
          page: currentPage,
          limit: 10,
          hospital: hospitalId,
        })
      );

      notification.success({
        title: "Campaign updated",
        description: "The campaign has been updated successfully.",

        duration: 2.5,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.error("The error is", error);
      notification.error({
        title: "Error",
        description:
          "There was an error updating the campaign. Please try again.",
        status: "error",
        duration: 2.5,
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
                value={formData.hospital}
                onChange={handleHospitalChange}
              >
                {hospitals?.map((hospital) => (
                  <option key={hospital.value} value={hospital.value}>
                    {hospital.label}
                  </option>
                ))}
              </Select>
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
