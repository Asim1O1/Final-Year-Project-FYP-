import React from 'react';
import { Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

export const SearchBar = () => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <InputGroup size="lg">
        <Input 
          placeholder="Enter your location"
          padding="1.5rem"
          borderRadius="md"
        />
        <InputRightElement width="5rem" height="100%">
          <Button 
            h="90%" 
            size="sm" 
            colorScheme="blue"
            className="px-8"
          >
            Search
          </Button>
        </InputRightElement>
      </InputGroup>
    </div>
  );
};