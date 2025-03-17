import React, { useEffect, useState } from "react";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import  TopSection  from "../../component/common/TopSection";
import Footer from "../../component/layout/Footer";
import HospitalCard from "../../component/common/HospitalCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllHospitals } from "../../features/hospital/hospitalSlice";
import Pagination from "../../utils/Pagination";

export const HospitalsPage = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = useSelector(
    (state) => state?.hospitalSlice?.hospitals?.Pagination?.totalPages
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    dispatch(fetchAllHospitals({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const { hospitals } = useSelector((state) => state?.hospitalSlice?.hospitals);

  return (
    <Box className="min-h-screen bg-gray-50">
      <TopSection />
      <Box className="max-w-7xl mx-auto px-4 py-8">
        {hospitals?.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {hospitals.map((hospital) => (
              <HospitalCard key={hospital._id} hospital={hospital} />
            ))}
          </SimpleGrid>
        ) : (
          <Text fontSize="xl" color="gray.500" textAlign="center" mt={10}>
            No hospitals available at the moment.
          </Text>
        )}
      </Box>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages || 1}
        onPageChange={handlePageChange}
      />
      <Footer />
    </Box>
  );
};

export default HospitalsPage;

