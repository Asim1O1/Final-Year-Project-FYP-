import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import { SearchBar } from "./SearchBar";
import { FilterTags } from "./FilterTags";
import Navbar from "../layout/NavBar";

export const TopSection = () => {
  return (
    <Box className="w-full bg-[#CDF5FD]">
      <Navbar bgColor="#CDF5FD" /> {/* Pass background color prop */}
      <Box className="max-w-7xl mx-auto px-4 py-8">
        <Heading textAlign="center" mb={8} color="blue.600">
          Find Hospitals Near You
        </Heading>
        <SearchBar />
        <FilterTags />
      </Box>
    </Box>
  );
};
