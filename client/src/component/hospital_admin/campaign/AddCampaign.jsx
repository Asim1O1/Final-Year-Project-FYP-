import React, { useEffect, useState } from "react";
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
  Textarea,
  Select,
  Input,
  Checkbox,
} from "@chakra-ui/react";
import { notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllHospitals } from "../../../features/hospital/hospitalSlice";
import { handleCampaignCreation } from "../../../features/campaign/campaignSlice";

const AddCampaignForm = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    hospital: "",
    allowVolunteers: false,
    maxVolunteers: 0,
  });

  const [errors, setErrors] = useState({});

  // Fetch hospitals from Redux store
  const hospitals = useSelector((state) => {
    if (state?.hospitalSlice?.hospitals?.hospitals) {
      return state.hospitalSlice.hospitals.hospitals;
    }
    return state?.hospitalSlice?.hospitals || [];
  });

  useEffect(() => {
    dispatch(fetchAllHospitals({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleHospitalChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, hospital: value }));
    if (errors.hospital) setErrors((prev) => ({ ...prev, hospital: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.hospital) newErrors.hospital = "Hospital is required";
    if (formData.allowVolunteers && formData.maxVolunteers <= 0)
      newErrors.maxVolunteers = "Maximum volunteers must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const campaignData = {
        ...formData,
      };

      const result = await dispatch(
        handleCampaignCreation(campaignData)
      ).unwrap();

      notification.success({
        message: "Campaign created",
        description: "The campaign has been created successfully.",
        duration: 5,
      });

      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        hospital: "",
        allowVolunteers: false,
        maxVolunteers: 0,
      });
      onClose();
    } catch (error) {
      notification.error({
        message: "Error",
        description:
          error.message ||
          "There was an error creating the campaign. Please try again.",
        duration: 5,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Campaign</ModalHeader>
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
              <Input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
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
                placeholder="Select Hospital"
                value={formData.hospital}
                onChange={handleHospitalChange}
              >
                {hospitals?.map((hospital) => (
                  <option key={hospital._id} value={hospital._id}>
                    {hospital.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.hospital}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Allow Volunteers</FormLabel>
              <Checkbox
                name="allowVolunteers"
                isChecked={formData.allowVolunteers}
                onChange={handleCheckboxChange}
              >
                Allow Volunteers
              </Checkbox>
            </FormControl>

            {formData.allowVolunteers && (
              <FormControl isInvalid={errors.maxVolunteers}>
                <FormLabel>Max Volunteers</FormLabel>
                <Input
                  name="maxVolunteers"
                  type="number"
                  placeholder="Enter max number of volunteers"
                  value={formData.maxVolunteers}
                  onChange={handleInputChange}
                />
                <FormErrorMessage>{errors.maxVolunteers}</FormErrorMessage>
              </FormControl>
            )}
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
            Create Campaign
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddCampaignForm;
