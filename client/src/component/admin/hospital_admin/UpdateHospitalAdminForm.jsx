import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  Stack,
  Select,
  Text,
  SimpleGrid,
  Flex,
  Icon,
  Box,
  useColorModeValue,
  InputLeftElement,
} from "@chakra-ui/react";
import { notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Building2, Mail, MapPin, User } from "lucide-react";
import { PhoneIcon } from "@chakra-ui/icons";

import {
  handleGetAllHospitalAdmins,
  handleHospitalAdminUpdate,
} from "../../../features/hospital_admin/hospitalAdminSlice";
import { fetchAllHospitals } from "../../../features/hospital/hospitalSlice";
import CustomLoader from "../../common/CustomSpinner";

const UpdateHospitalAdminForm = ({
  isOpen,
  onClose,
  adminData,
  searchQuery,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const inputBg = useColorModeValue("gray.50", "gray.700");

  const hospitals = useSelector(
    (state) => state?.hospitalSlice?.hospitals?.hospitals
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "male",
    address: "",
    hospitalId: "",
  });

  useEffect(() => {
    if (adminData) {
      setFormData({
        fullName: adminData.fullName || "",
        email: adminData.email || "",
        phone: adminData.phone || "",
        gender: adminData.gender || "male",
        address: adminData.address || "",
        hospitalId: adminData.hospital?._id || "",
      });
    }
  }, [adminData]);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAllHospitals());
    }
  }, [isOpen, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.hospitalId) {
      newErrors.hospitalId = "Please select a hospital";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      notification.error({
        message: "Form Error",
        description: "Please check all fields and try again",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("The admin datat is", adminData);
      const updatedData = {
        adminId: adminData._id,
        updatedData: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          gender: formData.gender,
          address: formData.address,
          hospital: formData.hospitalId,  
        },
      };
      const result = await dispatch(
        handleHospitalAdminUpdate(updatedData)
      ).unwrap();
      console.log("The result is", result);

      notification.success({
        message: "Success",
        description: result?.message || "Hospital admin updated successfully",
        duration: 3,
      });
      await dispatch(
        handleGetAllHospitalAdmins({
          page: currentPage,
          limit: 10,
          search: searchQuery,
        })
      ).unwrap();

      onClose();
    } catch (error) {
      console.error("Update error:", error);
      notification.error({
        message: "Error",
        description: error.message || "Failed to update hospital admin",
        duration: 3,
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
          zIndex="9999"
          bg="rgba(0, 0, 0, 0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CustomLoader
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
        <ModalContent bg={bgColor} borderRadius="xl" shadow="xl">
          <ModalHeader
            borderBottom="1px"
            borderColor={borderColor}
            py={4}
            px={6}
          >
            <Flex align="center" gap={3}>
              <Box bg="blue.500" p={2} borderRadius="lg" color="white">
                <User size={20} />
              </Box>
              <Text fontSize="lg" fontWeight="semibold">
                Update Hospital Administrator
              </Text>
            </Flex>
          </ModalHeader>

          <form onSubmit={handleSubmit}>
            <ModalBody py={6} px={6}>
              <SimpleGrid columns={2} spacing={6}>
                <Stack spacing={5}>
                  {/* Full Name Input */}
                  <FormControl isRequired isInvalid={errors.fullName}>
                    <FormLabel fontSize="sm" fontWeight="medium">
                      Full Name
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={User} size={18} className="text-gray-500" />
                      </InputLeftElement>
                      <Input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        bg={inputBg}
                        pl="40px"
                        fontSize="sm"
                        borderRadius="md"
                        _focus={{
                          borderColor: "blue.400",
                          boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                        }}
                      />
                    </InputGroup>
                    <FormErrorMessage>{errors.fullName}</FormErrorMessage>
                  </FormControl>

                  {/* Phone Input */}
                  <FormControl isRequired isInvalid={errors.phone}>
                    <FormLabel fontSize="sm" fontWeight="medium">
                      Phone Number
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon
                          as={PhoneIcon}
                          size={18}
                          className="text-gray-500"
                        />
                      </InputLeftElement>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        bg={inputBg}
                        pl="40px"
                        fontSize="sm"
                        borderRadius="md"
                        _focus={{
                          borderColor: "blue.400",
                          boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                        }}
                      />
                    </InputGroup>
                    <FormErrorMessage>{errors.phone}</FormErrorMessage>
                  </FormControl>

                  {/* Address Input */}
                  <FormControl isRequired isInvalid={errors.address}>
                    <FormLabel fontSize="sm" fontWeight="medium">
                      Address
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={MapPin} size={18} className="text-gray-500" />
                      </InputLeftElement>
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        bg={inputBg}
                        pl="40px"
                        fontSize="sm"
                        borderRadius="md"
                        _focus={{
                          borderColor: "blue.400",
                          boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                        }}
                      />
                    </InputGroup>
                    <FormErrorMessage>{errors.address}</FormErrorMessage>
                  </FormControl>

                  {/* Hospital Select */}
                  <FormControl isRequired isInvalid={errors.hospitalId}>
                    <FormLabel fontSize="sm" fontWeight="medium">
                      Hospital
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon
                          as={Building2}
                          size={18}
                          className="text-gray-500"
                        />
                      </InputLeftElement>
                      <Select
                        name="hospitalId"
                        value={formData.hospitalId}
                        onChange={handleChange}
                        bg={inputBg}
                        pl="40px"
                        fontSize="sm"
                        className="max-h-40 overflow-y-auto"
                      >
                        <option value="">Select Hospital</option>
                        {hospitals?.map((hospital) => (
                          <option key={hospital._id} value={hospital._id}>
                            {hospital.name}
                          </option>
                        ))}
                      </Select>
                    </InputGroup>
                    <FormErrorMessage>{errors.hospitalId}</FormErrorMessage>
                  </FormControl>
                </Stack>

                <Stack spacing={5}>
                  {/* Email Input */}
                  <FormControl isRequired isInvalid={errors.email}>
                    <FormLabel fontSize="sm" fontWeight="medium">
                      Email Address
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={Mail} size={18} className="text-gray-500" />
                      </InputLeftElement>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        bg={inputBg}
                        pl="40px"
                        fontSize="sm"
                        borderRadius="md"
                        _focus={{
                          borderColor: "blue.400",
                          boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                        }}
                      />
                    </InputGroup>
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>

                  {/* Gender Select */}
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="medium">
                      Gender
                    </FormLabel>
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      bg={inputBg}
                      fontSize="sm"
                      pl="3"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormControl>
                </Stack>
              </SimpleGrid>
            </ModalBody>

            <ModalFooter
              borderTop="1px"
              borderColor={borderColor}
              py={4}
              px={6}
            >
              <Button
                variant="ghost"
                mr={3}
                onClick={onClose}
                size="md"
                isDisabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                colorScheme="blue"
                size="md"
                isLoading={isLoading}
                loadingText="Updating..."
              >
                Update Administrator
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateHospitalAdminForm;
