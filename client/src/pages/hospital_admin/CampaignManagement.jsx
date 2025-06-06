import { useCallback, useEffect, useState } from "react";

import {
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import AddCampaignForm from "../../component/hospital_admin/campaign/AddCampaign";
import CampaignList from "../../component/hospital_admin/campaign/CampaignList";
import UpdateCampaignForm from "../../component/hospital_admin/campaign/UpdateCampaign";
import { fetchAllCampaigns } from "../../features/campaign/campaignSlice";

import { useDispatch, useSelector } from "react-redux";

import { notification } from "antd";
import { Plus } from "lucide-react";
import { fetchAllHospitals } from "../../features/hospital/hospitalSlice";

const CampaignManagement = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useDisclosure();
  const {
    hospitals,
    loading: hospitalsLoading,
    error: hospitalsError,
  } = useSelector((state) => state?.hospitalSlice?.hospitals);

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Redux state
  const {
    campaigns,
    loading: campaignsLoading,
    error: campaignsError,
    pagination,
  } = useSelector((state) => state.campaignSlice?.campaigns);
  const currentUser = useSelector((state) => state?.auth?.user?.data);
  const hospitalId = currentUser?.hospital;

  // Fetch campaigns with search filter
  useEffect(() => {
    dispatch(fetchAllHospitals());
  }, [dispatch]);
  const fetchCampaigns = useCallback(() => {
    dispatch(
      fetchAllCampaigns({
        page: currentPage,
        limit: 10,
        hospital: hospitalId,
        search: searchTerm,
      })
    );
  }, [currentPage, hospitalId, searchTerm, dispatch]);

  // Fetch campaigns on mount and when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCampaigns();
    }, 500); // Debounce search by 500ms

    return () => clearTimeout(timer);
  }, [fetchCampaigns]);

  // Handle errors
  useEffect(() => {
    if (campaignsError) {
      notification.error({
        message: "Error loading campaigns",
        description:
          campaignsError || "Unexpected error while campaign management",
        status: "error",
        duration: 5,
        isClosable: true,
      });
    }
  }, [campaignsError, toast]);

  const hospitalOptions =
    hospitals?.map((hospital) => ({
      value: hospital._id,
      label: hospital.name,
    })) || [];

  // Handlers
  const handleAddCampaign = () => {
    setSelectedCampaign(null);
    onAddOpen();
  };

  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    onUpdateOpen();
  };

  return (
    <Container maxW="container.xl" py={6}>
      {/* Header Section */}
      <Flex justify="space-between" align="center" mb={6}>
        <Stack spacing={1}>
          <Heading size="lg">Campaign Management</Heading>
          <Text color="gray.600">
            Showing {campaigns?.length || 0} campaigns
            {pagination?.totalCount ? ` of ${pagination.totalCount}` : ""}
          </Text>
        </Stack>
        <Button
          colorScheme="blue"
          leftIcon={<Plus size={20} />}
          onClick={handleAddCampaign}
        >
          Create New Campaign
        </Button>
      </Flex>

      {/* Search Input */}
      <Input
        placeholder="Search campaigns by name..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reset to first page when searching
        }}
        mb={6}
        maxW="400px"
      />

      {/* Campaign List */}
      <CampaignList
        campaigns={campaigns}
        isLoading={campaignsLoading}
        onEdit={handleEditCampaign}
      />

      {/* Modals */}
      <AddCampaignForm
        isOpen={isAddOpen}
        onClose={onAddClose}
        onSuccess={fetchCampaigns}
        hospitals={hospitalOptions}
      />
      <UpdateCampaignForm
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
        campaignData={selectedCampaign}
        hospials={hospitalOptions}
        onSuccess={fetchCampaigns}
      />
    </Container>
  );
};

export default CampaignManagement;
