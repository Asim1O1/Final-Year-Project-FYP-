import React from 'react';
import { Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

export const SearchBar = () => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <InputGroup size="lg">
        <Input 
          placeholder="Search hospitals by location..." 
          padding="1.5rem"
          borderRadius="md"
          focusBorderColor="blue.500"
          bg="white"
          boxShadow="sm"
        />
        <InputRightElement width="4rem" height="100%">
          <Button 
            h="100%" 
            size="md" 
            colorScheme="blue"
            borderRadius="md"
            rightIcon={<SearchIcon />}
            className="px-8"
          >
            Search
          </Button>
        </InputRightElement>
      </InputGroup>
    </div>
  );
};
