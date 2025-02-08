import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  Icon,
  Text,
  useColorModeValue,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAllHospitalAdmins } from "../../../features/hospital_admin/hospitalAdminSlice";
import Pagination from "../../../utils/Pagination";
import { Building2, Mail, Phone, User, MapPin } from "lucide-react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import UpdateHospitalAdmin from "./UpdateHospitalAdminForm";
import { handleHospitalAdminDeletion } from "../../../features/hospital_admin/hospitalAdminSlice";
import { notification } from "antd";

const HospitalAdminList = ({ onEdit, onDelete, searchQuery }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const cancelRef = useRef();

  const bgHover = useColorModeValue("blue.50", "blue.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.800", "white");

  const { hospitalAdmins, isLoading } = useSelector(
    (state) => state?.hospitalAdminSlice
  );

  useEffect(() => {
    dispatch(
      handleGetAllHospitalAdmins({
        page: currentPage,
        limit: 10,
        search: searchQuery,
      })
    );
  }, [dispatch, currentPage, searchQuery]);

  const { totalPages = 1 } = useSelector(
    (state) => state?.hospitalAdminSlice?.pagination || {}
  );

  const handleDeleteClick = (admin) => {
    setSelectedAdmin(admin);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (selectedAdmin) {
      setIsDeleting(true);
      try {
        await dispatch(handleHospitalAdminDeletion(selectedAdmin._id)).unwrap();

        notification.success({
          message: "Success",
          description: "Hospital admin deleted successfully",
          duration: 3,
        });

        await dispatch(
          handleGetAllHospitalAdmins({
            page: currentPage,
            limit: 10,
            search: searchQuery,
          })
        ).unwrap();

        onDeleteClose();
        setSelectedAdmin(null);
      } catch (error) {
        console.error("Error deleting the hospital admin:", error);
        notification.error({
          message: "Error",
          description:
            error?.message ||
            "Unable to delete hospital admin. Please try again.",
          duration: 3,
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEditClick = (admin) => {
    setSelectedAdmin(admin);
    onEditOpen();
  };

  const InfoItem = ({ icon, text, ...rest }) => (
    <Flex align="center" gap={2} {...rest}>
      <Icon as={icon} color={textColor} boxSize={4} />
      <Text color={textColor} fontSize="sm" noOfLines={1}>
        {text}
      </Text>
    </Flex>
  );

  return (
    <Card shadow="sm" variant="outline">
      <CardHeader borderBottomWidth="1px" borderColor={borderColor}>
        <Flex align="center" gap={2}>
          <Icon as={Building2} color="blue.500" boxSize={6} />
          <Heading size="md">Available Hospital Administrators</Heading>
        </Flex>
      </CardHeader>

      <CardBody p={4}>
        {isLoading ? (
          <Flex justify="center" py={8}>
            <Spinner size="xl" color="blue.500" />
          </Flex>
        ) : (
          <Flex direction="column" gap={4}>
            {hospitalAdmins?.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Text color={textColor}>No administrators found</Text>
              </Box>
            ) : (
              hospitalAdmins?.map((admin) => (
                <Box
                  key={admin._id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  borderColor={borderColor}
                  transition="all 0.2s"
                  _hover={{
                    bg: bgHover,
                    borderColor: "blue.200",
                    shadow: "md",
                  }}
                >
                  <Flex direction={{ base: "column", md: "row" }} gap={4}>
                    <Box flex="1">
                      <Flex align="center" gap={4} mb={4}>
                        <Box
                          w="12"
                          h="12"
                          borderRadius="full"
                          bg="blue.100"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text
                            fontSize="xl"
                            fontWeight="bold"
                            color="blue.600"
                          >
                            {admin.fullName.charAt(0)}
                          </Text>
                        </Box>
                        <Box>
                          <Heading size="sm" color={headingColor} mb={1}>
                            {admin.fullName}
                          </Heading>
                          <Badge colorScheme="blue" variant="subtle">
                            {admin.role}
                          </Badge>
                        </Box>
                      </Flex>

                      <Grid
                        templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }}
                        gap={3}
                        mb={3}
                      >
                        <InfoItem icon={Mail} text={admin.email} />
                        <InfoItem icon={Phone} text={admin.phone} />
                        <InfoItem icon={Building2} text={admin.hospital.name} />
                        <InfoItem icon={User} text={admin.gender} />
                      </Grid>

                      <Divider my={3} />

                      <Box>
                        <InfoItem icon={MapPin} text={admin.address} />
                      </Box>
                    </Box>

                    <Flex
                      direction={{ base: "row", md: "column" }}
                      gap={2}
                      minW={{ base: "full", md: "120px" }}
                      justify={{ base: "stretch", md: "flex-start" }}
                    >
                      <UpdateHospitalAdmin
                        isOpen={isEditOpen}
                        onClose={onEditClose}
                        adminData={selectedAdmin}
                      />

                      <Button
                        leftIcon={<EditIcon />}
                        colorScheme="blue"
                        variant="outline"
                        onClick={() => handleEditClick(admin)}
                        size="sm"
                        w="full"
                      >
                        Edit
                      </Button>

                      <Button
                        leftIcon={<DeleteIcon />}
                        colorScheme="red"
                        variant="outline"
                        onClick={() => handleDeleteClick(admin)}
                        size="sm"
                        w="full"
                      >
                        Delete
                      </Button>
                    </Flex>
                  </Flex>
                </Box>
              ))
            )}
          </Flex>
        )}

        {hospitalAdmins?.length > 0 && (
          <Box mt={6}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </Box>
        )}
      </CardBody>

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Administrator
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this administrator? This action
              cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Card>
  );
};

export default HospitalAdminList;
