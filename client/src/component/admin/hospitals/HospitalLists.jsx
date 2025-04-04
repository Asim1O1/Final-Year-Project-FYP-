import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Flex,
  IconButton,
  Spinner,
  Text,
  useDisclosure,
  Box,
  Image,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react";
import { Edit2, Trash2 } from "lucide-react";
import Pagination from "../../../utils/Pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllHospitals,
  handleHospitalDeletion,
} from "../../../features/hospital/hospitalSlice";

import UpdateHospitalForm from "./UpdateHospitalForm";
import { notification } from "antd";
import CustomLoader from "../../common/CustomSpinner";

const HospitalList = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const cancelRef = React.useRef();

  const [selectedHospital, setSelectedHospital] = useState(null);
  const [deletingHospital, setDeletingHospital] = useState(null);
  const hospitals = useSelector(
    (state) => state?.hospitalSlice?.hospitals?.hospitals
  );
  const totalPages = useSelector(
    (state) => state?.hospitalSlice?.data?.pagination?.totalPages
  );
  const { error, isLoading } = useSelector((state) => state?.hospitalSlice);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllHospitals({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditHospital = (hospital) => {
    console.log("Editing hospital:", hospital);
    setSelectedHospital(hospital);
    onOpen();
  };

  const handleCloseModal = () => {
    setSelectedHospital(null);
    onClose();
  };
  const handleDeleteHospital = (hospitalId) => {
    setDeletingHospital(hospitalId);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    const result = await dispatch(handleHospitalDeletion(deletingHospital));
    console.log("The result while deleting hospital is", result);
    if (handleHospitalDeletion.fulfilled.match(result)) {
      notification.success({
        message: "Hospital Deleted",
        description: "The hospital has been successfully deleted.",
        duration: 3,
      });

      // Fetch the updated list of hospitals
      await dispatch(
        fetchAllHospitals({ page: currentPage, limit: 10 })
      ).unwrap();
    } else {
      notification.error({
        message: "Deletion Failed",
        description:
          result?.payload?.error || "Something went wrong, please try again.",
        duration: 3,
      });
    }

    onDeleteClose();
    setDeletingHospital(null);
  };

  return (
    <Box className="bg-white rounded-lg shadow-sm">
      <Flex justify="flex-end" mb={4}></Flex>

      {isLoading ? (
        <Flex justifyContent="center" mt={4} p={8}>
          <CustomLoader
            size="xl"
            color="blue.500"
            thickness="4px"
            speed="0.65s"
          />
        </Flex>
      ) : error ? (
        <Flex justifyContent="center" mt={4} p={6}>
          <Text color="red.500" fontSize="lg">
            {error?.message || "An error occurred."}
          </Text>
        </Flex>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple" className="min-w-full">
            <Thead className="bg-gray-50">
              <Tr>
                <Th className="px-6 py-4">Image</Th>
                <Th className="px-6 py-4">Hospital Name</Th>
                <Th className="px-6 py-4">Location</Th>
                <Th className="px-6 py-4">Contact</Th>
                <Th className="px-6 py-4">Specialties</Th>
                <Th className="px-6 py-4">Tests</Th>
                <Th className="px-6 py-4">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {hospitals?.length > 0 ? (
                hospitals.map((hospital) => (
                  <Tr
                    key={hospital._id || hospital.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <Td className="px-6 py-4">
                      <Box
                        className="w-16 h-16 rounded-lg overflow-hidden"
                        boxShadow="sm"
                      >
                        <Image
                          src={
                            hospital.hospitalImage || "/api/placeholder/400/320"
                          }
                          alt={hospital.name}
                          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-200"
                        />
                      </Box>
                    </Td>
                    <Td className="px-6 py-4">
                      <Text fontWeight="medium" className="text-gray-900">
                        {hospital.name}
                      </Text>
                    </Td>
                    <Td className="px-6 py-4 text-gray-600">
                      {hospital.location}
                    </Td>
                    <Td className="px-6 py-4 text-gray-600">
                      {hospital.contactNumber}
                    </Td>
                    <Td className="px-6 py-4">
                      <Flex gap={2} flexWrap="wrap">
                        {hospital.specialties?.map((specialty, index) => (
                          <Badge
                            key={index}
                            colorScheme="blue"
                            variant="subtle"
                            className="px-2 py-1 rounded-full text-sm"
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </Flex>
                    </Td>
                    <Td className="px-6 py-4">
                      <Badge
                        colorScheme="green"
                        variant="subtle"
                        className="rounded-full px-3 py-1"
                      >
                        {hospital.medicalTests?.length || 0} tests
                      </Badge>
                    </Td>
                    <Td className="px-6 py-4">
                      <Flex gap={3}>
                        <IconButton
                          aria-label="Edit hospital"
                          icon={<Edit2 size={16} />}
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          className="hover:bg-blue-50"
                          onClick={() => handleEditHospital(hospital)}
                        />
                        <IconButton
                          aria-label="Delete hospital"
                          icon={<Trash2 size={16} />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          className="hover:bg-red-50"
                          onClick={() =>
                            handleDeleteHospital(hospital._id || hospital.id)
                          }
                        />
                      </Flex>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={7}>
                    <Text textAlign="center" color="gray.500" className="py-8">
                      No hospitals found.
                    </Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages || 1}
        onPageChange={handlePageChange}
      />

      <UpdateHospitalForm
        isOpen={isOpen}
        onClose={handleCloseModal}
        hospital={selectedHospital}
      />
      <AlertDialog isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Hospital
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this hospital? This action cannot
              be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};
export default HospitalList;
